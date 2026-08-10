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
/**
 * Construct save path: {RootFolder}/{Category}/{Filename}
 *
 * New flat structure (no format subfolders):
 *   Pictures/Mushi QR Pro/QR Codes/qrcode_20260811.png
 *   Pictures/Mushi QR Pro/QR Codes/mushi-qr-batch.zip
 *   Pictures/Mushi QR Pro/Barcodes/barcode_ean13_20260811.pdf
 *   Pictures/Mushi QR Pro/Barcodes/mushi-barcode-batch.zip
 *
 * The root folder is user-configurable via Settings (defaults to
 * Pictures/Mushi QR Pro which maps to /storage/emulated/0/Pictures/Mushi QR Pro
 * on Android ExternalStorage).
 */
export function getOrganizedFilePath(filename, category = 'QR Codes') {
  let prefs = {};
  try { prefs = getPreferences() || {}; } catch {}
  const rootFolder = prefs.saveLocation || 'Pictures/Mushi QR Pro';

  // Only two top-level categories:
  //   'QR Codes'  — all QR formats + bulk QR ZIPs
  //   'Barcodes'  — all barcode formats + bulk barcode ZIPs
  const catLower = (category || '').toLowerCase();
  const categoryDir = catLower.includes('barcode') ? 'Barcodes' : 'QR Codes';

  return `${rootFolder}/${categoryDir}/${filename}`;
}

/**
 * Save file natively into internal storage under organized directory structure.
 */
async function saveFileNative(base64Data, filename, category = 'QR Codes') {
  try { await Filesystem.requestPermissions(); } catch {}

  const organizedPath = getOrganizedFilePath(filename, category);
  let fileUri = null;
  let isSavedToDocs = false;
  const targetDir = Capacitor.getPlatform() === 'android' ? Directory.ExternalStorage : Directory.Documents;

  // 1. Save directly into organized directory (ExternalStorage on Android, Documents on iOS)
  try {
    const docFile = await Filesystem.writeFile({
      path: organizedPath,
      data: base64Data,
      directory: targetDir,
      recursive: true,
    });
    fileUri = docFile.uri;
    isSavedToDocs = true;
  } catch (docErr) {
    console.warn('Writing to ExternalStorage failed, trying Documents organized path:', docErr);
    try {
      const fallbackFile = await Filesystem.writeFile({
        path: organizedPath,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });
      fileUri = fallbackFile.uri;
      isSavedToDocs = true;
    } catch (fallbackErr) {
      console.error('Writing to target directory failed:', fallbackErr);
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

  // 4. Removed automatic native Share sheet on save.
  // The share action is now handled manually via the Success Modal.

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
