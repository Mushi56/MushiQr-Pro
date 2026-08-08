import { jsPDF } from 'jspdf';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Media } from '@capacitor-community/media';
import { getPreferences } from './storage';

/**
 * Convert an ArrayBuffer to a base64 string (binary-safe, no btoa size limits).
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

/**
 * Convert a plain string to base64 in chunks (avoids call stack overflow on large SVGs).
 */
function stringToBase64(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return arrayBufferToBase64(bytes.buffer);
}

/**
 * Construct organized path: {RootFolder}/{Category}/{Format}/{Filename}
 * E.g.: "Mushi QR Pro/QR Codes/PNG/qrcode_123.png"
 * E.g.: "Mushi QR Pro/Barcodes/PDF/barcode_123.pdf"
 * E.g.: "Mushi QR Pro/Bulk Batch Generation/ZIP/batch.zip"
 */
export function getOrganizedFilePath(filename, category = 'QR Codes') {
  let prefs = {};
  try { prefs = getPreferences() || {}; } catch {}
  const rootFolder = prefs.saveLocation || 'Mushi QR Pro';

  // Standardize category: 'QR Codes' | 'Barcodes' | 'Bulk Batch Generation'
  let categoryDir = 'QR Codes';
  const catLower = (category || '').toLowerCase();
  if (catLower.includes('barcode')) {
    categoryDir = 'Barcodes';
  } else if (catLower.includes('batch') || catLower.includes('bulk')) {
    categoryDir = 'Bulk Batch Generation';
  } else {
    categoryDir = 'QR Codes';
  }

  // Standardize format folder: PNG | JPG | SVG | PDF | ZIP
  let formatDir = 'PNG';
  const ext = filename.split('.').pop().toUpperCase();
  if (['PNG', 'JPG', 'JPEG', 'SVG', 'PDF', 'ZIP'].includes(ext)) {
    formatDir = ext === 'JPEG' ? 'JPG' : ext;
  }

  return `${rootFolder}/${categoryDir}/${formatDir}/${filename}`;
}

/**
 * Save file natively into internal storage under organized directory structure.
 */
async function saveFileNative(base64Data, filename, category = 'QR Codes') {
  try { await Filesystem.requestPermissions(); } catch {}

  const organizedPath = getOrganizedFilePath(filename, category);
  let fileUri = null;
  let isSavedToDocs = false;

  // 1. Save directly into organized Documents directory
  try {
    const docFile = await Filesystem.writeFile({
      path: organizedPath,
      data: base64Data,
      directory: Directory.Documents,
      recursive: true,
    });
    fileUri = docFile.uri;
    isSavedToDocs = true;
  } catch (docErr) {
    console.warn('Writing organized path failed, trying root Documents:', docErr);
    try {
      const fallbackFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });
      fileUri = fallbackFile.uri;
      isSavedToDocs = true;
    } catch (fallbackErr) {
      console.error('Writing to Documents failed:', fallbackErr);
    }
  }

  // 2. Cache fallback if Documents write failed
  if (!fileUri) {
    try {
      const cacheFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache,
        recursive: true,
      });
      fileUri = cacheFile.uri;
    } catch {}
  }

  // 3. For image formats (PNG/JPG), attempt to copy to Media gallery
  if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
    try {
      await Media.requestPermissions();
      if (fileUri) {
        await Media.savePhoto({ path: fileUri, albumIdentifier: 'Mushi QR Pro' });
      }
    } catch (mediaErr) {
      console.warn('Media photo save notice:', mediaErr);
    }
  }

  // 4. Open native Share sheet so user can share or inspect file
  if (fileUri) {
    try {
      await Share.share({
        title: 'Mushi QR Pro',
        text: `Saved to ${organizedPath}`,
        url: fileUri,
        dialogTitle: 'Save or Share your File',
      });
    } catch (shareErr) {}
  }

  return isSavedToDocs ? 'saved' : 'share';
}

function triggerDownload(url, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
}

export async function downloadPNG(canvas, filename = 'qrcode', category = 'QR Codes') {
  const dataUrl = canvas.toDataURL('image/png');
  if (Capacitor.isNativePlatform()) {
    return await saveFileNative(dataUrl.split(',')[1], `${filename}.png`, category);
  } else {
    triggerDownload(dataUrl, `${filename}.png`);
    return 'download';
  }
}

export async function downloadJPG(canvas, filename = 'qrcode', category = 'QR Codes') {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const ctx = tempCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  ctx.drawImage(canvas, 0, 0);
  
  const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
  if (Capacitor.isNativePlatform()) {
    return await saveFileNative(dataUrl.split(',')[1], `${filename}.jpg`, category);
  } else {
    triggerDownload(dataUrl, `${filename}.jpg`);
    return 'download';
  }
}

export async function downloadSVG(canvas, filename = 'qrcode', category = 'QR Codes') {
  const pngBase64 = canvas.toDataURL('image/png').split(',')[1];

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${canvas.width}" height="${canvas.height}"
     viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" xlink:href="data:image/png;base64,${pngBase64}"/>
</svg>`;

  if (Capacitor.isNativePlatform()) {
    const base64Data = stringToBase64(svgContent);
    return await saveFileNative(base64Data, `${filename}.svg`, category);
  } else {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `${filename}.svg`);
    URL.revokeObjectURL(url);
    return 'download';
  }
}

export async function downloadPDF(canvas, filename = 'qrcode', category = 'QR Codes') {
  const imgData = canvas.toDataURL('image/png');
  const size = 210;
  const margin = 20;
  const qrSize = size - margin * 2;
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  pdf.addImage(imgData, 'PNG', margin, margin, qrSize, qrSize);
  
  if (Capacitor.isNativePlatform()) {
    const pdfArrayBuffer = pdf.output('arraybuffer');
    const base64Data = arrayBufferToBase64(pdfArrayBuffer);
    return await saveFileNative(base64Data, `${filename}.pdf`, category);
  } else {
    pdf.save(`${filename}.pdf`);
    return 'download';
  }
}
