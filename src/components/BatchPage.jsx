import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, Edit3, Trash2, ArrowLeft, Check, AlertCircle, Info, Sparkles, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { generateQRMatrix, renderQR } from '../utils/qrEngine';
import { jsPDF } from 'jspdf';

// Helper for mobile ZIP saving
async function saveZipNative(base64Data, filename) {
  try { await Filesystem.requestPermissions(); } catch {}
  const savedFile = await Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: Directory.Cache,
  });
  await Share.share({
    title: 'Mushi Qr Pro - Batch Export',
    url: savedFile.uri,
    dialogTitle: 'Save or Share your Batch QR ZIP',
  });
}

export default function BatchPage({ 
  onNavigate, 
  activeGeneratorStyle, 
  setBatchItems, 
  batchItems,
  onEditBatchItemStyle 
}) {
  const [fileData, setFileData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [dataCol, setDataCol] = useState('');
  const [nameCol, setNameCol] = useState('');
  const [hasHeader, setHasHeader] = useState(true);
  const [exportQuality, setExportQuality] = useState('Normal');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const fileInputRef = useRef(null);

  const QUALITY_SIZES = {
    'Low': 512,
    'Normal': 1024,
    'HD': 2048,
    'HQ': 4096
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    reader.onload = (e) => {
      try {
        let rows = [];
        if (isExcel) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        } else {
          const text = e.target.result;
          rows = parseCSV(text);
        }

        if (rows.length === 0) {
          alert('The file appears to be empty.');
          return;
        }

        // Determine columns
        const firstRow = rows[0] || [];
        const colList = firstRow.map((val, idx) => ({
          index: idx,
          label: val ? val.toString().trim() : `Column ${idx + 1}`
        }));

        setColumns(colList);
        setFileData(rows);

        // Auto-select columns
        if (colList.length > 0) {
          setDataCol(colList[0].index.toString());
          if (colList.length > 1) {
            setNameCol(colList[1].index.toString());
          } else {
            setNameCol('none');
          }
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse file. Please verify the format.');
      }
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const parseCSV = (text) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push("");
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        lines.push(row);
        row = [""];
      } else {
        row[row.length - 1] += char;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row);
    }
    return lines;
  };

  const handleImport = () => {
    if (!fileData || dataCol === '') return;

    const startIndex = hasHeader ? 1 : 0;
    const imported = [];

    for (let i = startIndex; i < fileData.length; i++) {
      const row = fileData[i];
      if (!row || row.length === 0) continue;

      const qrData = row[parseInt(dataCol)];
      if (!qrData || qrData.toString().trim() === '') continue;

      const fileNameVal = nameCol !== 'none' && nameCol !== '' ? row[parseInt(nameCol)] : null;
      const cleanFileName = fileNameVal 
        ? fileNameVal.toString().trim().replace(/[^a-zA-Z0-9-_]/g, '_') 
        : `qr_code_${i - startIndex + 1}`;

      imported.push({
        id: `batch-${Date.now()}-${i}`,
        data: qrData.toString().trim(),
        filename: cleanFileName,
        style: { ...activeGeneratorStyle } // Copies current editor design
      });
    }

    setBatchItems(imported);
    setFileData(null); // Clear raw upload state to show table
  };

  const applyGlobalStyle = () => {
    if (batchItems.length === 0) return;
    const updated = batchItems.map(item => ({
      ...item,
      style: { ...activeGeneratorStyle }
    }));
    setBatchItems(updated);
  };

  const handleRemoveItem = (id) => {
    setBatchItems(batchItems.filter(item => item.id !== id));
  };

  const handleClearBatch = () => {
    if (window.confirm('Remove all items from the batch?')) {
      setBatchItems([]);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,QR Data,Filename\nhttps://google.com,google_qr\nhttps://youtube.com,youtube_qr\nConnect to Free WiFi,wifi_qr";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mushi_batch_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateZip = async () => {
    if (batchItems.length === 0) return;
    setIsExporting(true);
    setExportProgress(0);

    const zip = new JSZip();
    const exportSize = QUALITY_SIZES[exportQuality] || 1024;

    for (let idx = 0; idx < batchItems.length; idx++) {
      const item = batchItems[idx];
      
      // Render canvas offscreen
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = exportSize;
      tempCanvas.height = exportSize;

      const matrixInfo = generateQRMatrix(item.data, item.style.errorCorrection || 'H');
      
      renderQR(tempCanvas, {
        ...matrixInfo,
        size: exportSize,
        ...item.style,
        showHandle: false,
        selectedType: null
      });

      // 1. PNG Base64
      const pngDataUrl = tempCanvas.toDataURL('image/png');
      const pngBase64 = pngDataUrl.split(',')[1];

      // 2. SVG XML
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${exportSize}" height="${exportSize}"
     viewBox="0 0 ${exportSize} ${exportSize}">
  <image width="${exportSize}" height="${exportSize}" xlink:href="data:image/png;base64,${pngBase64}"/>
</svg>`;

      // 3. PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const pdfSize = 210;
      const margin = 20;
      const qrSize = pdfSize - margin * 2;
      pdf.addImage(pngDataUrl, 'PNG', margin, margin, qrSize, qrSize);
      const pdfArrayBuffer = pdf.output('arraybuffer');

      // Add to ZIP files structure
      zip.file(`png/${item.filename}.png`, pngBase64, { base64: true });
      zip.file(`svg/${item.filename}.svg`, svgContent);
      zip.file(`pdf/${item.filename}.pdf`, pdfArrayBuffer);

      setExportProgress(Math.round(((idx + 1) / batchItems.length) * 100));
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      if (Capacitor.isNativePlatform()) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result.split(',')[1];
          await saveZipNative(base64Data, 'mushi-qr-batch.zip');
          setIsExporting(false);
        };
        reader.readAsDataURL(content);
      } else {
        saveAs(content, 'mushi-qr-batch.zip');
        setIsExporting(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to package ZIP archive.');
      setIsExporting(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px var(--main-padding-x) 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        zIndex: 10
      }}>
        <button 
          onClick={() => onNavigate('home')}
          style={{
            background: 'var(--bg-hover)',
            border: 'none',
            borderRadius: '12px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Batch QR Generator</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>Generate multiple branded QR codes at once</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px var(--main-padding-x) 100px' }}>
        {/* Step 1: Upload or Import */}
        {!fileData && batchItems.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="glass-panel"
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '24px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'rgba(214, 0, 54, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <Upload size={32} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Upload CSV or Excel</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 max(20px, 10%)', lineHeight: '1.4' }}>
                Select a `.csv`, `.xlsx`, or `.xls` file containing your QR code entries.
              </p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".csv, .xlsx, .xls" 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={downloadSampleCSV}
                style={{
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FileSpreadsheet size={24} className="text-accent" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px' }}>Download Sample Template</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 400 }}>Get a template showing correctly structured data</div>
                </div>
                <Download size={18} style={{ opacity: 0.6 }} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Columns Mapping */}
        {fileData && (
          <div className="glass-panel" style={{ borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} className="text-accent" /> Column Mapping
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="hasHeader" 
                checked={hasHeader} 
                onChange={(e) => setHasHeader(e.target.checked)} 
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <label htmlFor="hasHeader" style={{ fontSize: '14px', fontWeight: 500 }}>First row contains headers</label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Select QR Data Column</label>
                <select 
                  className="form-select" 
                  value={dataCol} 
                  onChange={(e) => setDataCol(e.target.value)}
                >
                  {columns.map(col => (
                    <option key={col.index} value={col.index}>{col.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Filename Column (Optional)</label>
                <select 
                  className="form-select" 
                  value={nameCol} 
                  onChange={(e) => setNameCol(e.target.value)}
                >
                  <option value="none">-- Autogenerate Filenames --</option>
                  {columns.map(col => (
                    <option key={col.index} value={col.index}>{col.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                onClick={handleImport}
                style={{
                  flex: 1,
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Import Entries
              </button>
              <button 
                onClick={() => setFileData(null)}
                style={{
                  background: 'var(--bg-hover)',
                  color: 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px 20px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Batch List and Export */}
        {batchItems.length > 0 && !fileData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Actions Panel */}
            <div className="glass-panel" style={{ borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 700 }}>Batch Summary</span>
                <span style={{ fontSize: '13px', background: 'rgba(214, 0, 54, 0.1)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  {batchItems.length} QR Codes
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={applyGlobalStyle}
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                  }}
                >
                  <RefreshCw size={16} /> Apply Active Editor Style
                </button>
                
                <button 
                  onClick={handleClearBatch}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    color: '#EF4444'
                  }}
                >
                  <Trash2 size={16} /> Clear All
                </button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <label className="form-label" style={{ marginBottom: '6px' }}>Export Quality</label>
                    <select 
                      className="form-select" 
                      value={exportQuality} 
                      onChange={(e) => setExportQuality(e.target.value)}
                    >
                      <option value="Low">Low (512px)</option>
                      <option value="Normal">Normal (1024px)</option>
                      <option value="HD">HD (2048px)</option>
                      <option value="HQ">HQ (4096px)</option>
                    </select>
                  </div>

                  <button 
                    onClick={generateZip}
                    disabled={isExporting}
                    style={{
                      flex: 1.5,
                      minWidth: '200px',
                      background: 'var(--accent-gradient)',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '14px',
                      color: 'white',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(214, 0, 54, 0.25)',
                      marginTop: '18px'
                    }}
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="spinning" size={20} />
                        Exporting Zip ({exportProgress}%)
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        Generate & Download ZIP
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Batch List Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0' }}>QR Code Preview Items</h4>
              {batchItems.map((item, idx) => (
                <div 
                  key={item.id}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}>
                    <QRThumbnail data={item.data} style={item.style} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.filename}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.data}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => onEditBatchItemStyle(item, idx)}
                      title="Edit QR style in generator"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--bg-hover)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove item"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'var(--bg-hover)',
                        border: '1px solid var(--border-color)',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mini preview canvas renderer for each row
function QRThumbnail({ data, style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const matrixInfo = generateQRMatrix(data, style.errorCorrection || 'H');
    renderQR(canvasRef.current, {
      ...matrixInfo,
      size: 100,
      ...style,
      showHandle: false,
      selectedType: null
    });
  }, [data, style]);

  return (
    <canvas 
      ref={canvasRef} 
      width="100" 
      height="100" 
      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
    />
  );
}
