import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, Edit3, Trash2, ArrowLeft, Check, AlertCircle, Info, Sparkles, RefreshCw, FileImage, FileCode, FileText, Layers, X } from 'lucide-react';
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
    dialogTitle: 'Save or Share your Bulk QR ZIP',
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
  const [selectedFormat, setSelectedFormat] = useState('ALL');
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

    // Preload all unique logo images in batchItems
    const logoCache = {};
    const logoPromises = [];
    batchItems.forEach(item => {
      const src = item.style?.logo?.src;
      if (src && !logoCache[src]) {
        logoCache[src] = null; // placeholder
        logoPromises.push(
          new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              logoCache[src] = img;
              resolve();
            };
            img.onerror = () => resolve();
            img.src = src;
          })
        );
      }
    });

    if (logoPromises.length > 0) {
      await Promise.all(logoPromises);
    }

    const zip = new JSZip();
    const exportSize = QUALITY_SIZES[exportQuality] || 1024;

    for (let idx = 0; idx < batchItems.length; idx++) {
      const item = batchItems[idx];
      
      // Render canvas offscreen
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = exportSize;
      tempCanvas.height = exportSize;

      const matrixInfo = generateQRMatrix(item.data, item.style.errorCorrection || 'H');
      const logoImgElement = item.style?.logo?.src ? logoCache[item.style.logo.src] : null;

      renderQR(tempCanvas, {
        ...matrixInfo,
        size: exportSize,
        ...item.style,
        logo: logoImgElement,
        textCenter: item.style.textCenterEnabled ? item.style.textCenterText : null,
        showHandle: false,
        selectedType: null
      });

      // 1. PNG Base64
      let pngDataUrl = '';
      let pngBase64 = '';
      if (selectedFormat === 'ALL' || selectedFormat === 'PNG' || selectedFormat === 'SVG' || selectedFormat === 'PDF') {
        pngDataUrl = tempCanvas.toDataURL('image/png');
        pngBase64 = pngDataUrl.split(',')[1];
      }

      // 2. JPG Base64
      let jpgDataUrl = '';
      let jpgBase64 = '';
      if (selectedFormat === 'ALL' || selectedFormat === 'JPG') {
        // Draw white background for JPG since JPEG does not support transparency
        const jpgCanvas = document.createElement('canvas');
        jpgCanvas.width = exportSize;
        jpgCanvas.height = exportSize;
        const ctx = jpgCanvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, exportSize, exportSize);
        ctx.drawImage(tempCanvas, 0, 0);
        jpgDataUrl = jpgCanvas.toDataURL('image/jpeg', 0.9);
        jpgBase64 = jpgDataUrl.split(',')[1];
      }

      // Add to ZIP files structure depending on selected format
      if (selectedFormat === 'ALL' || selectedFormat === 'PNG') {
        zip.file(`png/${item.filename}.png`, pngBase64, { base64: true });
      }

      if (selectedFormat === 'ALL' || selectedFormat === 'JPG') {
        zip.file(`jpg/${item.filename}.jpg`, jpgBase64, { base64: true });
      }

      if (selectedFormat === 'ALL' || selectedFormat === 'SVG') {
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${exportSize}" height="${exportSize}"
     viewBox="0 0 ${exportSize} ${exportSize}">
  <image width="${exportSize}" height="${exportSize}" xlink:href="data:image/png;base64,${pngBase64}"/>
</svg>`;
        zip.file(`svg/${item.filename}.svg`, svgContent);
      }

      if (selectedFormat === 'ALL' || selectedFormat === 'PDF') {
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
        zip.file(`pdf/${item.filename}.pdf`, pdfArrayBuffer);
      }

      setExportProgress(Math.round(((idx + 1) / batchItems.length) * 100));
      // Yield control back to browser event loop to prevent unresponsive page freeze
      await new Promise(resolve => setTimeout(resolve, 0));
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
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header matching modal styling */}
      <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div className="modal-header-title">
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Bulk QR Generator</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>Generate multiple branded QR codes at once</p>
        </div>
        <button className="modal-close" onClick={() => onNavigate('home')}>
          <X size={20} />
        </button>
      </div>

      <div className="modal-content" style={{ flex: 1, padding: '20px var(--main-padding-x) 100px' }}>
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

              {/* Design Style Preview Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '12px 16px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  <QRThumbnail data={batchItems[0]?.data || "Preview"} style={batchItems[0]?.style || activeGeneratorStyle} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Bulk QR Style Template</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Click edit to customize the style of all QRs</div>
                </div>
                <button
                  onClick={() => onEditBatchItemStyle(batchItems[0], 0)}
                  title="Customize batch design"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--accent-gradient)',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(214, 0, 54, 0.2)'
                  }}
                >
                  <Edit3 size={16} />
                </button>
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

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Export Format Section matching app design */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Export Format</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {[
                      { label: 'ALL', Icon: Layers },
                      { label: 'PNG', Icon: FileImage },
                      { label: 'SVG', Icon: FileCode },
                      { label: 'PDF', Icon: FileText },
                      { label: 'JPG', Icon: FileImage },
                    ].map(({ label, Icon }) => (
                      <button
                        key={label}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFormat(label);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          aspectRatio: '1 / 1',
                          padding: '0',
                          background: selectedFormat === label ? 'var(--accent-soft)' : 'var(--bg-hover)',
                          border: '1px solid',
                          borderColor: selectedFormat === label ? 'var(--accent-primary)' : 'transparent',
                          borderRadius: '12px',
                          color: selectedFormat === label ? 'var(--accent-primary)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Icon size={18} />
                        <span style={{ fontSize: '10px', fontWeight: 700 }}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Quality matching app design */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Export Quality</div>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: 800, 
                      color: 'var(--accent-primary)',
                      background: 'var(--accent-soft)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(214, 0, 54, 0.15)',
                      letterSpacing: '0.5px'
                    }}>
                      {exportQuality === 'Low' && '512px'}
                      {exportQuality === 'Normal' && '1024px'}
                      {exportQuality === 'HD' && '2048px'}
                      {exportQuality === 'HQ' && '4096px'}
                    </span>
                  </div>
                  <div style={{ padding: '0 8px', marginTop: '12px', marginBottom: '8px' }}>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="1"
                      value={['Low', 'Normal', 'HD', 'HQ'].indexOf(exportQuality)}
                      onChange={(e) => {
                        const steps = ['Low', 'Normal', 'HD', 'HQ'];
                        const selected = steps[parseInt(e.target.value)] || 'Normal';
                        setExportQuality(selected);
                      }}
                      className="export-quality-slider"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      <span>Low</span>
                      <span>Normal</span>
                      <span>HD</span>
                      <span>4K</span>
                    </div>
                  </div>
                </div>

                {isExporting ? (
                  <div style={{
                    width: '100%',
                    height: '48px',
                    background: 'var(--bg-hover)',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    marginTop: '10px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${exportProgress}%`,
                      background: 'var(--accent-gradient)',
                      transition: 'width 0.1s ease-out'
                    }} />
                    <span style={{
                      position: 'relative',
                      zIndex: 1,
                      fontWeight: 700,
                      fontSize: '13px',
                      color: exportProgress > 50 ? '#FFFFFF' : 'var(--text-primary)'
                    }}>
                      Exporting Bulk QR... {exportProgress}%
                    </span>
                  </div>
                ) : (
                  <button 
                    onClick={generateZip}
                    style={{
                      width: '100%',
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
                      marginTop: '10px'
                    }}
                  >
                    <Download size={20} />
                    Generate & Download {selectedFormat} ZIP
                  </button>
                )}
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

function QRThumbnail({ data, style }) {
  const canvasRef = useRef(null);
  const [loadedLogoImg, setLoadedLogoImg] = useState(null);
  const safeStyle = style || {};

  // Load logo image if it exists in style
  useEffect(() => {
    if (safeStyle.logo && safeStyle.logo.src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setLoadedLogoImg(img);
      };
      img.src = safeStyle.logo.src;
    } else {
      setLoadedLogoImg(null);
    }
  }, [safeStyle.logo?.src]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const matrixInfo = generateQRMatrix(data, safeStyle.errorCorrection || 'H');
    
    // Override style.logo and textCenter with render-safe mappings
    renderQR(canvasRef.current, {
      ...matrixInfo,
      size: 100,
      ...safeStyle,
      logo: safeStyle.logo && safeStyle.logo.src ? loadedLogoImg : null,
      textCenter: safeStyle.textCenterEnabled ? safeStyle.textCenterText : null,
      showHandle: false,
      selectedType: null
    });
  }, [data, safeStyle, loadedLogoImg]);

  return (
    <canvas 
      ref={canvasRef} 
      width="100" 
      height="100" 
      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
    />
  );
}
