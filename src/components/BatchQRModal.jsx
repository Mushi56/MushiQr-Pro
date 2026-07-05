import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Download, Check, AlertCircle, Play, Loader } from 'lucide-react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { generateQRMatrix, renderQR } from '../utils/qrEngine';

export default function BatchQRModal({ 
  isOpen, 
  onClose, 
  qrOptions = {}, 
  preloadedBatchData = null, 
  onStartDesignMode = null, 
  onUpdateBatchConfig = null 
}) {
  const [fileData, setFileData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [previewRows, setPreviewRows] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle', 'loaded', 'generating', 'success', 'error'
  const [progress, setProgress] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [exportFormat, setExportFormat] = useState('all'); // 'png', 'svg', 'pdf', 'all'
  const [applyCustomDesign, setApplyCustomDesign] = useState(true);
  const [batchQuality, setBatchQuality] = useState('Medium');
  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (preloadedBatchData) {
        setColumns(preloadedBatchData.columns || []);
        setSelectedColumn(preloadedBatchData.selectedColumn || '');
        setPreviewRows((preloadedBatchData.rows || []).slice(0, 5));
        setFileData(preloadedBatchData.rows || null);
        setTotalCount((preloadedBatchData.rows || []).length);
        setStatus('loaded');
      } else {
        setStatus('idle');
        setFileData(null);
        setColumns([]);
        setSelectedColumn('');
        setPreviewRows([]);
        setProgress(0);
      }
    }
  }, [isOpen, preloadedBatchData]);

  useEffect(() => {
    if (status === 'loaded' && fileData && selectedColumn && previewCanvasRef.current) {
      const colIdx = columns.indexOf(selectedColumn);
      const firstRowValue = fileData[0]?.[colIdx]?.trim();
      if (firstRowValue) {
        const matrixInfo = generateQRMatrix(firstRowValue, qrOptions.ecLevel || 'H');
        if (matrixInfo) {
          renderQR(previewCanvasRef.current, {
            ...qrOptions,
            ...matrixInfo,
            size: 256
          });
        }
      }
    }
  }, [status, fileData, selectedColumn, columns, qrOptions]);

  const handleColumnChange = (e) => {
    const val = e.target.value;
    setSelectedColumn(val);
    if (onUpdateBatchConfig) {
      onUpdateBatchConfig(val);
    }
  };

  if (!isOpen) return null;

  // Simple, robust CSV parser supporting quoted values
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
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push("");
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      try {
        const rows = parseCSV(text);
        if (rows.length < 2) {
          alert('CSV file must have at least a header row and one data row.');
          return;
        }

        const headers = rows[0].map(h => h.trim() || 'Column');
        const dataRows = rows.slice(1).filter(r => r.some(cell => cell.trim() !== ''));

        setColumns(headers);
        setSelectedColumn(headers[0]);
        setPreviewRows(dataRows.slice(0, 5));
        setFileData(dataRows);
        setTotalCount(dataRows.length);
        setStatus('loaded');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };
    reader.readAsText(file);
  };

  const generateBatch = async () => {
    if (!fileData || !selectedColumn) return;
    setStatus('generating');
    setProgress(0);

    const columnIndex = columns.indexOf(selectedColumn);
    const zip = new JSZip();
    const tempCanvas = document.createElement('canvas');

    const QUALITY_SIZES = {
      Low: 512,
      Medium: 1024,
      High: 2048,
      Ultra: 4096
    };
    const size = QUALITY_SIZES[batchQuality] || 1024;
    tempCanvas.width = size;
    tempCanvas.height = size;

    for (let i = 0; i < fileData.length; i++) {
      const row = fileData[i];
      const text = row[columnIndex]?.trim();
      if (!text) continue;

      // 1. Generate QR matrix
      const matrixInfo = generateQRMatrix(text, qrOptions.ecLevel || 'H');
      if (!matrixInfo) continue;

      // 2. Render to canvas
      const options = applyCustomDesign ? {
        ...qrOptions,
        ...matrixInfo,
        size: size,
      } : {
        ...matrixInfo,
        size: size,
        bgColor: '#ffffff',
        qrColor: '#000000',
        dotStyle: 'square',
        eyeStyle: 'square',
        gradientEnabled: false,
        logo: null,
        frameStyle: 'none'
      };
      renderQR(tempCanvas, options);

      const baseName = `qr_${i + 1}_${text.replace(/[^a-z0-9]/gi, '_').substring(0, 15)}`;

      // 3. Add to ZIP according to formats
      if (exportFormat === 'png' || exportFormat === 'all') {
        const pngData = tempCanvas.toDataURL('image/png').split(',')[1];
        zip.file(`${baseName}.png`, pngData, { base64: true });
      }

      if (exportFormat === 'svg' || exportFormat === 'all') {
        const pngBase64 = tempCanvas.toDataURL('image/png').split(',')[1];
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${size}" height="${size}"
     viewBox="0 0 ${size} ${size}">
  <image width="${size}" height="${size}" xlink:href="data:image/png;base64,${pngBase64}"/>
</svg>`;
        zip.file(`${baseName}.svg`, svgContent);
      }

      if (exportFormat === 'pdf' || exportFormat === 'all') {
        const imgData = tempCanvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const margin = 20;
        const qrSize = 210 - margin * 2;
        pdf.addImage(imgData, 'PNG', margin, margin, qrSize, qrSize);
        const pdfArrayBuffer = pdf.output('arraybuffer');
        zip.file(`${baseName}.pdf`, pdfArrayBuffer);
      }

      setProgress(Math.round(((i + 1) / fileData.length) * 100));
      // Give UI thread a small break to update progress bar
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mushi_batch_qrs_${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 11000 }}>
      <div 
        className="modal-container glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '520px', padding: '24px' }}
      >
        <div className="modal-header" style={{ padding: '0 0 16px 0' }}>
          <div className="modal-header-title">
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Batch QR Code Generator</h3>
            <p>Generate hundreds of QR codes from a CSV file</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content" style={{ padding: '0', maxHeight: '70vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {status === 'idle' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '24px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'var(--bg-hover)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <Upload size={40} style={{ color: 'var(--accent-primary)', marginBottom: '16px' }} />
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Upload CSV File</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Select a .csv file containing your QR code list
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".csv" 
                style={{ display: 'none' }} 
              />
            </div>
          )}

          {status === 'loaded' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Select QR Data Column</label>
                <select 
                  className="form-select" 
                  value={selectedColumn} 
                  onChange={handleColumnChange}
                >
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              {/* Preview & Customization Card */}
              <div style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <canvas 
                  ref={previewCanvasRef} 
                  width="100" 
                  height="100" 
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    background: '#fff',
                    border: '1px solid var(--border-color)',
                    padding: '4px',
                    flexShrink: 0
                  }}
                />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: 'var(--text-primary)' }}>QR Template Design</div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: '1.3' }}>
                    Preview of your first QR code. Customize its colors, shapes, logo, or frames interactively.
                  </p>
                  <button
                    onClick={() => {
                      const colIdx = columns.indexOf(selectedColumn);
                      const firstRowValue = fileData[0]?.[colIdx]?.trim();
                      if (onStartDesignMode) {
                        onStartDesignMode({
                          rows: fileData,
                          columns: columns,
                          selectedColumn: selectedColumn,
                          fileName: fileInputRef.current?.files?.[0]?.name || 'batch_file.csv'
                        }, firstRowValue);
                      }
                    }}
                    style={{
                      background: 'var(--accent-gradient)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px var(--accent-glow)'
                    }}
                  >
                    Customize Design
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Export Quality</label>
                  <select 
                    className="form-select" 
                    value={batchQuality} 
                    onChange={(e) => setBatchQuality(e.target.value)}
                  >
                    <option value="Low">Low (512px)</option>
                    <option value="Medium">Medium (1024px)</option>
                    <option value="High">High (2048px)</option>
                    <option value="Ultra">Ultra (4096px)</option>
                  </select>
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '12px 14px', height: '42px', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Apply Custom Design</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={applyCustomDesign}
                      onChange={(e) => setApplyCustomDesign(e.target.checked)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--accent-primary)',
                        cursor: 'pointer',
                        margin: 0
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Export Format</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                  {['all', 'png', 'svg', 'pdf'].map(format => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '12px',
                        background: exportFormat === format ? 'var(--accent-gradient)' : 'var(--bg-hover)',
                        border: '1px solid var(--border-color)',
                        color: exportFormat === format ? 'white' : 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Preview */}
              <div>
                <label className="form-label" style={{ marginBottom: '8px' }}>Data Preview (Total: {totalCount} rows)</label>
                <div style={{
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-tertiary)' }}>Row</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-tertiary)' }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, idx) => {
                        const colIdx = columns.indexOf(selectedColumn);
                        return (
                          <tr key={idx} style={{ borderBottom: idx < previewRows.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                            <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{idx + 1}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                              {row[colIdx] || '(empty)'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  onClick={() => setStatus('idle')} 
                  style={{
                    flex: 1, height: '54px', borderRadius: '18px',
                    background: 'var(--bg-hover)', border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Change File
                </button>
                <button 
                  onClick={generateBatch} 
                  style={{
                    flex: 2, height: '54px', borderRadius: '18px',
                    background: 'var(--accent-gradient)', border: 'none',
                    color: 'white', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 8px 20px var(--accent-glow)'
                  }}
                >
                  <Play size={16} /> Generate {totalCount} QRs
                </button>
              </div>
            </div>
          )}

          {status === 'generating' && (
            <div style={{ textAlign: 'center', padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Loader size={36} className="text-accent animate-spin" />
              <div style={{ fontWeight: 800, fontSize: '18px' }}>Generating ZIP Package...</div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.1s' }} />
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {progress}% Complete
              </div>
            </div>
          )}

          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)', color: '#10B981',
                display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
              }}>
                <Check size={32} />
              </div>
              <div style={{ fontWeight: 800, fontSize: '20px' }}>ZIP Package Downloaded!</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
                All {totalCount} QR codes were successfully generated and bundled into your download folder.
              </p>
              <button 
                onClick={onClose} 
                className="modal-done-btn"
                style={{ width: '100%', margin: '0' }}
              >
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
