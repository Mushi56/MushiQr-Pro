import { useState, useRef, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import {
  ArrowLeft, Zap, ZapOff, Image, CheckCircle2,
  Copy, ExternalLink, Share2, Star, Wifi, Mail,
  Phone, User, Globe, FileText, Minus, Plus, AlertCircle, RefreshCcw, Clock,
  ScanLine, Info, ShieldAlert, Barcode, X, Monitor, Loader2
} from 'lucide-react';
import { generateQRMatrix, renderQR } from '../utils/qrEngine';
import qrNotFoundSvg from '../assets/qr-not-found.svg';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import qrcode from 'qrcode-generator';

// ─── Barcode format metadata ──────────────────────────────────────────────────
// Formats supported by html5-qrcode (ZXing) for live camera scanning
const SCANNABLE_FORMATS = [
  { id: Html5QrcodeSupportedFormats.QR_CODE,       name: 'QR Code',     category: '2D' },
  { id: Html5QrcodeSupportedFormats.DATA_MATRIX,   name: 'Data Matrix', category: '2D' },
  { id: Html5QrcodeSupportedFormats.PDF_417,        name: 'PDF417',      category: '2D' },
  { id: Html5QrcodeSupportedFormats.AZTEC,          name: 'Aztec',       category: '2D' },
  { id: Html5QrcodeSupportedFormats.EAN_13,         name: 'EAN-13',      category: '1D' },
  { id: Html5QrcodeSupportedFormats.EAN_8,          name: 'EAN-8',       category: '1D' },
  { id: Html5QrcodeSupportedFormats.UPC_A,          name: 'UPC-A',       category: '1D' },
  { id: Html5QrcodeSupportedFormats.UPC_E,          name: 'UPC-E',       category: '1D' },
  { id: Html5QrcodeSupportedFormats.CODE_128,       name: 'Code 128',    category: '1D' },
  { id: Html5QrcodeSupportedFormats.CODE_39,        name: 'Code 39',     category: '1D' },
  { id: Html5QrcodeSupportedFormats.CODE_93,        name: 'Code 93',     category: '1D' },
  { id: Html5QrcodeSupportedFormats.ITF,            name: 'ITF (I25)',   category: '1D' },
  { id: Html5QrcodeSupportedFormats.CODABAR,        name: 'Codabar',     category: '1D' },
  { id: Html5QrcodeSupportedFormats.MAXICODE,       name: 'MaxiCode',    category: '2D' },
];

const ALL_SCANNABLE_IDS = SCANNABLE_FORMATS.map(f => f.id);

// These are producible by bwip-js but NOT scannable by a mobile camera lens
// (require specialized hardware, printed dots/circles, or ultra-high resolution)
const CAMERA_UNSUPPORTED_FORMATS = new Set([
  'MaxiCode',    // requires specialized IR scanner
  'Han Xin',    // no ZXing support
  'Pharmacode', // 1-7 bars only - too ambiguous for ZXing
  'Channel Code',// industrial specialized
  'MSI Plessey', // not in ZXing
  'Telepen',    // UK-only, not in ZXing
  'Royal Mail', // postal-only hardware
  'POSTNET',    // postal-only hardware
  'PLANET',     // postal-only hardware
]);

const FORMAT_NAME_MAP = {
  [Html5QrcodeSupportedFormats.QR_CODE]:     'QR Code',
  [Html5QrcodeSupportedFormats.DATA_MATRIX]: 'Data Matrix',
  [Html5QrcodeSupportedFormats.PDF_417]:     'PDF417',
  [Html5QrcodeSupportedFormats.AZTEC]:       'Aztec',
  [Html5QrcodeSupportedFormats.EAN_13]:      'EAN-13',
  [Html5QrcodeSupportedFormats.EAN_8]:       'EAN-8',
  [Html5QrcodeSupportedFormats.UPC_A]:       'UPC-A',
  [Html5QrcodeSupportedFormats.UPC_E]:       'UPC-E',
  [Html5QrcodeSupportedFormats.CODE_128]:    'Code 128',
  [Html5QrcodeSupportedFormats.CODE_39]:     'Code 39',
  [Html5QrcodeSupportedFormats.CODE_93]:     'Code 93',
  [Html5QrcodeSupportedFormats.ITF]:         'ITF / I2of5',
  [Html5QrcodeSupportedFormats.CODABAR]:     'Codabar',
  [Html5QrcodeSupportedFormats.MAXICODE]:    'MaxiCode',
};

const parseQRData = (text) => {
  if (!text) return { type: 'Text', icon: FileText, title: 'Text Content', action: 'Copy Text', actionIcon: Copy };
  const t = text.trim();
  if (/^WIFI:S:.*?;/i.test(t)) return { type: 'WiFi', icon: Wifi, title: 'WiFi Network', action: 'Copy Password', actionIcon: Copy };
  if (/^mailto:/i.test(t)) return { type: 'Email', icon: Mail, title: 'Email Address', action: 'Send Email', actionIcon: Mail };
  if (/^tel:/i.test(t) || /^sms:/i.test(t)) return { type: 'Phone', icon: Phone, title: 'Phone Number', action: 'Call / SMS', actionIcon: Phone };
  if (/^BEGIN:VCARD/i.test(t)) return { type: 'Contact', icon: User, title: 'Contact Card', action: 'Save Contact', actionIcon: User };
  if (/^https?:\/\//i.test(t) || /^www\./i.test(t) || /^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.[a-z]{2,}(\/.*)?$/i.test(t))
    return { type: 'Website', icon: Globe, title: 'Website', action: 'Open Link', actionIcon: ExternalLink };
  return { type: 'Text', icon: FileText, title: 'Text Content', action: 'Copy Text', actionIcon: Copy };
};

function genSessionId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'mqs-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default function QRScanner({ onBack, navigateTo }) {
  const [status, setStatus] = useState('SCANNING');
  const [result, setResult] = useState(null);
  const [qrTypeData, setQrTypeData] = useState(null);
  const [detectedFormatId, setDetectedFormatId] = useState(null);
  const [detectedFormatName, setDetectedFormatName] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [facingBack, setFacingBack] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomCapabilities, setZoomCapabilities] = useState(null);
  const [hasHardwareZoom, setHasHardwareZoom] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showFormatsInfo, setShowFormatsInfo] = useState(false);

  const [scanMode, setScanMode] = useState('single'); // 'single' | 'continuous'
  const [continuousScans, setContinuousScans] = useState([]);
  const [successFlash, setSuccessFlash] = useState(false);

  const [sessionId] = useState(() => genSessionId());
  const [pcRelayEnabled, setPcRelayEnabled] = useState(false);
  const [appendEnter, setAppendEnter] = useState(true);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [showPcModal, setShowPcModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pcUrl, setPcUrl] = useState('');
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    const base = window.location.origin;
    const url = `${base}/scanner-pc.html?session=${sessionId}`;
    setPcUrl(url);
  }, [sessionId]);

  useEffect(() => {
    if (!pcUrl || !qrCanvasRef.current || !showPcModal) return;
    try {
      const qr = qrcode(0, 'M');
      qr.addData(pcUrl);
      qr.make();
      const count = qr.getModuleCount();
      const size = 180;
      const cell = Math.floor(size / count);
      const canvas = qrCanvasRef.current;
      if (!canvas) return;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#000000';
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.isDark(r, c)) {
            ctx.fillRect(c * cell, r * cell, cell, cell);
          }
        }
      }
    } catch (e) {
      console.warn('QR generation failed:', e);
    }
  }, [pcUrl, showPcModal]);

  const qrScannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);
  const busyRef = useRef(false);
  const touchStateRef = useRef({ distance: 0, initialZoom: 1 });
  const capTimersRef = useRef([]);
  const zoomRafRef = useRef(null);
  const lastScanRef = useRef({ text: '', time: 0 });

  const triggerHapticFeedback = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
    }
  }, []);

  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Failed to play scan sound:", e);
    }
  }, []);

  const triggerScanFeedback = useCallback(() => {
    playBeep();
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => { });
    } else if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  }, [playBeep]);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const stopScanner = useCallback(async () => {
    busyRef.current = false;
    const scanner = qrScannerRef.current;
    if (scanner) {
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
      qrScannerRef.current = null;
    }
    const container = document.getElementById("qr-scanner-viewport");
    if (container) {
      container.innerHTML = "";
    }
    setZoomCapabilities(null);
    setFlashOn(false);
    setFlashSupported(false);
    capTimersRef.current.forEach(clearTimeout);
    capTimersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const safeBack = useCallback(() => { triggerHapticFeedback(); stopScanner(); if (onBack) onBack(); }, [stopScanner, onBack, triggerHapticFeedback]);

  const applyZoom = useCallback(async (value) => {
    try {
      const videoElement = document.querySelector("#qr-scanner-viewport video");
      const stream = videoElement?.srcObject;
      const track = stream?.getVideoTracks()?.[0];
      if (videoElement) {
        let applied = false;
        if (track) {
          const caps = typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
          if (caps.zoom) {
            const minVal = caps.zoom.min || 1;
            const maxVal = caps.zoom.max || 8;
            const val = Math.min(Math.max(value, minVal), maxVal);
            try {
              await track.applyConstraints({ advanced: [{ zoom: val }] });
              setZoom(val);
              applied = true;
            } catch (err) {
              console.warn('Hardware zoom failed:', err);
            }
          }
        }
        
        // CSS scale zoom fallback (works everywhere, including Capacitor Android APK WebViews)
        if (!applied) {
          const val = Math.min(Math.max(value, 1), 4);
          videoElement.style.transform = `translateZ(0) scale(${val})`;
          videoElement.style.transformOrigin = 'center center';
          setZoom(val);
        }
      }
    } catch (err) {
      console.error('applyZoom error:', err);
    }
  }, []);

  const toggleFlash = useCallback(async () => {
    triggerHapticFeedback();
    try {
      const videoElement = document.querySelector("#qr-scanner-viewport video");
      const stream = videoElement?.srcObject;
      const track = stream?.getVideoTracks()?.[0];
      if (!track) return;
      const next = !flashOn;
      await track.applyConstraints({
        advanced: [{ torch: next }]
      });
      setFlashOn(next);
    } catch (err) {
      console.error('Torch toggle error:', err);
    }
  }, [flashOn, triggerHapticFeedback]);

  const handleScanResult = useCallback((decodedText, decodedResult) => {
    if (!mountedRef.current || busyRef.current) return;

    // Relay to PC if enabled
    if (pcRelayEnabled) {
      const toSend = prefix + decodedText + suffix + (appendEnter ? '\n' : '');
      setIsSending(true);
      fetch(`https://ntfy.sh/${sessionId}`, {
        method: 'POST',
        body: toSend,
        headers: {
          'Title': 'barcode',
          'Priority': '4',
          'Tags': 'barcode_scan',
        },
      }).catch(e => {
        console.warn('PC Relay POST failed:', e);
      }).finally(() => {
        setIsSending(false);
      });
    }

    // Detect format from result metadata
    const fmtId = decodedResult?.result?.format?.format
      ?? decodedResult?.decodedResult?.result?.format?.format
      ?? null;
    const fmtName = fmtId != null ? (FORMAT_NAME_MAP[fmtId] || 'Unknown') : null;

    if (scanMode === 'continuous') {
      const now = Date.now();
      if (decodedText === lastScanRef.current.text && now - lastScanRef.current.time < 1500) {
        return; // Ignore duplicate scans within 1.5 seconds
      }
      lastScanRef.current = { text: decodedText, time: now };

      // Play Beep & Vibrate
      triggerScanFeedback();

      // Show green flash indicator
      setSuccessFlash(true);
      setTimeout(() => {
        if (mountedRef.current) setSuccessFlash(false);
      }, 350);

      // Add to recently scanned list
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setContinuousScans(prev => [...prev, { text: decodedText, format: fmtName || 'Barcode', time: timeStr }]);

      // Save to storage history
      let thumbnail = null;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const matrixInfo = generateQRMatrix(decodedText, 'M');
        if (matrixInfo) {
          renderQR(canvas, {
            matrix: matrixInfo.matrix,
            moduleCount: matrixInfo.moduleCount,
            size: 120,
            qrColor: '#000000',
            bgColor: '#ffffff',
            bgTransparent: false
          });
          thumbnail = canvas.toDataURL('image/jpeg', 0.5);
        }
      } catch (err) {
        console.error('Failed to generate thumbnail for scanned QR:', err);
      }

      import('../utils/storage').then(({ saveToHistory }) => {
        saveToHistory({
          source: 'scan',
          qrData: { text: decodedText },
          type: (fmtName || 'BARCODE').toUpperCase(),
          displayText: decodedText,
          thumbnail: thumbnail
        });
      });

      return; // Do not pause scanner or change status to DETECTED
    }

    // Otherwise, handle single scan (standard mode)
    setStatus(prev => {
      if (prev === 'DETECTED') return prev;
      triggerScanFeedback();

      const scanner = qrScannerRef.current;
      if (scanner) {
        try { scanner.pause(); } catch { }
      }

      if (fmtId != null) setDetectedFormatId(fmtId);
      if (fmtName) setDetectedFormatName(fmtName);

      const parsed = parseQRData(decodedText);
      setQrTypeData(parsed);
      setResult(decodedText);
      let thumbnail = null;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const matrixInfo = generateQRMatrix(decodedText, 'M');
        if (matrixInfo) {
          renderQR(canvas, {
            matrix: matrixInfo.matrix,
            moduleCount: matrixInfo.moduleCount,
            size: 120,
            qrColor: '#000000',
            bgColor: '#ffffff',
            bgTransparent: false
          });
          thumbnail = canvas.toDataURL('image/jpeg', 0.5);
        }
      } catch (err) {
        console.error('Failed to generate thumbnail for scanned QR:', err);
      }

      import('../utils/storage').then(({ saveToHistory }) => {
        saveToHistory({
          source: 'scan',
          qrData: { text: decodedText },
          type: (fmtName || parsed.type).toUpperCase(),
          displayText: decodedText,
          thumbnail: thumbnail
        });
      });
      return 'DETECTED';
    });
  }, [scanMode, triggerScanFeedback, pcRelayEnabled, sessionId, prefix, suffix, appendEnter]);

  const startScanner = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    if (!mountedRef.current) return;
    setResult(null); setQrTypeData(null); setDetectedFormatId(null); setDetectedFormatName(null); setError(null); setStatus('SCANNING'); setZoom(1); setVideoPlaying(false);
    try {
      await stopScanner();
      if (!mountedRef.current) { busyRef.current = false; return; }

      const scanner = new Html5Qrcode("qr-scanner-viewport");
      qrScannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 25,
          qrbox: (width, height) => {
            return { width: Math.min(width, height) * 0.85, height: Math.min(width, height) * 0.55 };
          },
          aspectRatio: 1.333333,
          formatsToSupport: ALL_SCANNABLE_IDS,
          experimentalFeatures: { useBarCodeDetectorIfSupported: true }
        },
        (decodedText, decodedResult) => {
          handleScanResult(decodedText, decodedResult);
        },
        () => {}
      );

      setVideoPlaying(true);
      if (!mountedRef.current) { busyRef.current = false; return; }
      capTimersRef.current.forEach(clearTimeout);
      capTimersRef.current = [];

      const checkCapabilities = () => {
        try {
          const videoElement = document.querySelector("#qr-scanner-viewport video");
          const stream = videoElement?.srcObject;
          const track = stream?.getVideoTracks()?.[0];
          if (track) {
            const caps = typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
            if (caps.zoom) {
              setHasHardwareZoom(true);
              setZoomCapabilities({
                min: caps.zoom.min || 1,
                max: Math.min(caps.zoom.max || 10, 10),
                step: caps.zoom.step || 0.1
              });
              setZoom(prev => prev === 1 ? (caps.zoom.min || 1) : prev);
            } else {
              setHasHardwareZoom(false);
              setZoomCapabilities({
                min: 1,
                max: 4,
                step: 0.1
              });
            }
            if (caps.torch) {
              setFlashSupported(true);
            }
          }
        } catch (e) {
          console.warn('Failed to check capabilities:', e);
        }
      };

      checkCapabilities();
      const t1 = setTimeout(checkCapabilities, 500);
      const t2 = setTimeout(checkCapabilities, 1000);
      capTimersRef.current.push(t1, t2);

      busyRef.current = false;
      setStatus('SCANNING');
    } catch (err) {
      busyRef.current = false;
      if (!mountedRef.current) return;
      let msg = 'Failed to start camera.';
      const m = typeof err?.message === 'string' ? err.message : typeof err === 'string' ? err : '';
      if (m.includes('NotAllowed') || m.includes('Permission')) msg = 'Camera permission denied. Please allow camera access in Settings.';
      else if (m.includes('NotReadable') || m.includes('in use')) msg = 'Camera is in use by another app.';
      else if (m.includes('NotFound')) msg = 'No camera found on this device.';
      else if (m) msg = m;
      setError(msg); setStatus('ERROR'); await stopScanner();
    }
  }, [stopScanner, handleScanResult]);

  useEffect(() => { const t = setTimeout(() => { if (mountedRef.current) startScanner(); }, 200); return () => clearTimeout(t); }, []); // eslint-disable-line

  const handleFileUpload = async (file) => {
    if (!file) return;
    await stopScanner(); setStatus('LOADING'); setResult(null); setQrTypeData(null); setError(null);
    try {
      const scanner = new Html5Qrcode("qr-scanner-viewport", false);
      const decodedText = await scanner.scanFile(file, true);
      if (mountedRef.current) handleScanResult(decodedText);
    } catch (err) {
      if (mountedRef.current) { setError('No QR code or barcode found in this image.'); setStatus('ERROR'); }
    }
  };

  const handleCopy = async () => {
    triggerHapticFeedback();
    if (!result) return;
    try { await navigator.clipboard.writeText(result); } catch { const t = document.createElement('textarea'); t.value = result; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    triggerHapticFeedback();
    if (!result) return;
    try { await Share.share({ title: 'Scanned QR Code', text: result, dialogTitle: 'Share QR Content' }); }
    catch { if (navigator.share) navigator.share({ title: 'Scanned QR Code', text: result }).catch(() => { }); }
  };

  const handleSave = async () => {
    triggerHapticFeedback();
    if (!result || !qrTypeData) return;
    let thumbnail = null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const matrixInfo = generateQRMatrix(result, 'M');
      if (matrixInfo) {
        renderQR(canvas, {
          matrix: matrixInfo.matrix,
          moduleCount: matrixInfo.moduleCount,
          size: 120,
          qrColor: '#000000',
          bgColor: '#ffffff',
          bgTransparent: false
        });
        thumbnail = canvas.toDataURL('image/jpeg', 0.5);
      }
    } catch (err) {
      console.error('Failed to generate thumbnail for saved scanned QR:', err);
    }

    import('../utils/storage').then(({ saveToSaved }) => {
      saveToSaved({
        qrData: { text: result },
        type: qrTypeData.type.toUpperCase(),
        displayText: result,
        thumbnail: thumbnail
      });
    });
    alert('Saved to favorites!');
  };

  const handlePrimaryAction = async () => {
    triggerHapticFeedback();
    if (!result || !qrTypeData) return;
    const t = result.trim();
    try {
      if (qrTypeData.type === 'Website') {
        const url = /^https?:\/\//i.test(t) ? t : 'https://' + t;
        if (Capacitor.isNativePlatform()) { await Browser.open({ url, windowName: '_system' }); } else { window.open(url, '_blank'); }
      } else if (qrTypeData.type === 'WiFi') {
        const p = t.match(/P:(.*?);/); await navigator.clipboard.writeText(p ? p[1] : t); alert(p ? 'WiFi Password Copied!' : 'WiFi details copied.');
      } else if (qrTypeData.type === 'Email' || qrTypeData.type === 'Phone') { window.location.href = t; }
      else if (qrTypeData.type === 'Contact') { const b = new Blob([t], { type: 'text/vcard' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'contact.vcf'; a.click(); }
      else { await handleCopy(); }
    } catch (err) { console.error('Action failed:', err); }
  };

  const resumeScanning = () => {
    triggerHapticFeedback();
    const scanner = qrScannerRef.current;
    if (scanner) {
      try { scanner.start(); } catch { }
    } else {
      startScanner();
    }
    setResult(null); setQrTypeData(null); setDetectedFormatId(null); setDetectedFormatName(null); setStatus('SCANNING');
  };

  const captureImage = useCallback(async () => {
    triggerHapticFeedback();
    const video = document.querySelector("#qr-scanner-viewport video");
    if (!video) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || video.clientWidth || 640;
      canvas.height = video.videoHeight || video.clientHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      await stopScanner();

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setError('Failed to capture image.');
          setStatus('ERROR');
          return;
        }
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        try {
          const scanner = new Html5Qrcode("qr-scanner-viewport", false);
          const decodedText = await scanner.scanFile(file, true);
          if (mountedRef.current) {
            handleScanResult(decodedText);
          }
        } catch {
          if (mountedRef.current) {
            setError('No QR code or barcode found in the captured image.');
            setStatus('ERROR');
          }
        }
      }, 'image/jpeg', 0.95);
    } catch (err) {
      console.error('Capture failed:', err);
      setError('Failed to capture camera frame.');
      setStatus('ERROR');
    }
  }, [stopScanner, handleScanResult, triggerHapticFeedback]);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2 && zoomCapabilities) {
      const d = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
      touchStateRef.current = { distance: d, initialZoom: zoom };
    }
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && zoomCapabilities) {
      if (zoomRafRef.current) return;
      const d = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
      const targetZoom = touchStateRef.current.initialZoom * (d / touchStateRef.current.distance);
      zoomRafRef.current = requestAnimationFrame(() => {
        applyZoom(targetZoom);
        zoomRafRef.current = null;
      });
    }
  };

  const ActionIcon = qrTypeData?.actionIcon || ExternalLink;
  const TypeIcon = qrTypeData?.icon || FileText;

  return (
    <div className="scanner-page scanner-page-enter">
      <div className="qrs">
        {/* Header removed as it overlaps with app upper navbar */}

        {/* Body */}
        <div className="qrs-body" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} style={{ justifyContent: 'flex-end', paddingBottom: '24px' }}>
          {/* Error - QR Not Found (illustrated) */}
          {status === 'ERROR' && error && error.toLowerCase().includes('no qr') ? (
            <div 
              className="qrs-no-qr-screen"
              onTouchStart={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
            >
              <img src={qrNotFoundSvg} alt="No QR Code Found" className="qrs-no-qr-illustration" />
              <h2 className="qrs-no-qr-title">No QR Code <span>Found</span></h2>
              <p className="qrs-no-qr-desc">We couldn't find any QR code in the image.<br />Try a clearer image or check the lighting.</p>
              <button className="qrs-no-qr-btn" onClick={startScanner}>
                <RefreshCcw size={18} /> Try Again
              </button>
              <div className="qrs-no-qr-tip">
                <div className="qrs-no-qr-tip-icon">💡</div>
                <div>
                  <div className="qrs-no-qr-tip-title">Tips for better results</div>
                  <div className="qrs-no-qr-tip-text">Ensure the QR code is within the frame, well-lit, and not blurry.</div>
                </div>
              </div>
            </div>
          ) : status === 'ERROR' ? (
            <div 
              className="qrs-center-msg"
              onTouchStart={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
            >
              <AlertCircle size={44} color="#ef4444" />
              <p>{error}</p>
              <button className="qrs-retry-btn" onClick={startScanner}><RefreshCcw size={16} /> Try Again</button>
            </div>
          ) : null}


          {/* Scanner Frame */}
          <div className={`qrs-frame ${status === 'DETECTED' ? 'detected' : ''}`}>
            <div id="qr-scanner-viewport" className={`qrs-viewport ${status === 'DETECTED' ? 'blur' : ''}`} />

            {successFlash && (
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '4px solid #34C759',
                boxShadow: 'inset 0 0 40px rgba(52, 199, 89, 0.4)',
                backgroundColor: 'rgba(52, 199, 89, 0.08)',
                zIndex: 10,
                pointerEvents: 'none',
                transition: 'all 0.1s ease-in-out'
              }} />
            )}



            {/* Flashlight button inside camera */}
            {flashSupported && (
              <button className={`qrs-flash-viewport-btn ${flashOn ? 'on' : ''}`} onClick={toggleFlash} aria-label="Toggle flash">
                {flashOn ? <Zap size={22} /> : <ZapOff size={22} />}
              </button>
            )}

            {/* PC Connection Settings Button (Monitor) */}
            <button 
              className={`qrs-flash-viewport-btn ${pcRelayEnabled ? 'on' : ''}`} 
              onClick={() => { triggerHapticFeedback(); setShowPcModal(true); }}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                right: 'auto',
                background: pcRelayEnabled ? 'rgba(52, 199, 89, 0.25)' : 'rgba(0,0,0,0.5)',
                borderColor: pcRelayEnabled ? 'rgba(52, 199, 89, 0.4)' : 'rgba(255,255,255,0.15)',
                color: pcRelayEnabled ? '#34C759' : '#fff',
                zIndex: 15
              }}
              title="PC Connection Settings"
              aria-label="PC Connection"
            >
              {isSending ? <Loader2 className="animate-spin" size={20} /> : <Monitor size={20} />}
            </button>

            {/* Laser Scanning Line */}
            {status === 'SCANNING' && <div className="qrs-laser" />}
            {status === 'DETECTED' && <div className="qrs-laser frozen" />}

            {/* Zoom overlay inside viewport frame */}
            {status === 'SCANNING' && zoomCapabilities && (
              <div className="qrs-zoom">
                <button onClick={() => applyZoom(zoom - 0.5)}><Minus size={14} /></button>
                <input type="range" min={zoomCapabilities.min} max={zoomCapabilities.max} step={zoomCapabilities.step} value={zoom} onChange={e => applyZoom(parseFloat(e.target.value))} />
                <button onClick={() => applyZoom(zoom + 0.5)}><Plus size={14} /></button>
                <span>{zoom.toFixed(1)}x</span>
              </div>
            )}
          </div>
        </div>

        {/* Recently Scanned Items Overlay (Continuous Scan Mode) */}
        {scanMode === 'continuous' && continuousScans.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '100px',
            left: '16px',
            right: '16px',
            maxHeight: '130px',
            overflowY: 'auto',
            background: 'rgba(2, 6, 17, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '12px 14px',
            zIndex: 10,
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Recently Scanned ({continuousScans.length})</span>
              <button 
                onClick={() => setContinuousScans([])}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '10px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Clear All
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '6px', overflowY: 'auto', flex: 1 }}>
              {continuousScans.slice(-3).map((item, idx) => (
                <div key={idx} className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '6px 10px', borderRadius: '8px', borderLeft: '3px solid #34C759', border: '1px solid var(--border-color)', borderLeftWidth: '3px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>{item.format} • {item.time}</span>
                  </div>
                  <span style={{ color: '#34C759', fontWeight: 800, fontSize: '11px', marginLeft: 8, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C759', display: 'inline-block' }} /> Scanned
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="qrs-mode-selector" style={{ position: 'relative', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => {
                triggerHapticFeedback();
                setScanMode('single');
              }}
              className={`qrs-mode-tab ${scanMode === 'single' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontSize: '13px', fontWeight: 600 }}
            >
              Single Scan
              {scanMode === 'single' && <div className="qrs-mode-dot" style={{ background: 'var(--accent-primary)' }} />}
            </button>
            <button
              onClick={() => {
                triggerHapticFeedback();
                setScanMode('continuous');
                // Resume camera scanning if we were paused
                if (status === 'DETECTED') {
                  setStatus('SCANNING');
                  const scanner = qrScannerRef.current;
                  if (scanner) {
                    try { scanner.start(); } catch { }
                  } else {
                    startScanner();
                  }
                }
              }}
              className={`qrs-mode-tab ${scanMode === 'continuous' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontSize: '13px', fontWeight: 600 }}
            >
              Continuous Scan
              {scanMode === 'continuous' && <div className="qrs-mode-dot" style={{ background: 'var(--accent-primary)' }} />}
            </button>
          </div>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '4px 8px' }}
            onClick={() => setShowFormatsInfo(v => !v)}
          >
            <Info size={14} />
            Formats
          </button>
        </div>

        {/* Supported Formats Modal Popup */}
        {showFormatsInfo && (
          <div className="modal-overlay" style={{ zIndex: 11000 }} onClick={() => setShowFormatsInfo(false)}>
            <div className="modal-container glass-panel" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ScanLine size={20} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div className="modal-header-title" style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>Scan Formats</h3>
                    <p style={{ margin: 0 }}>Supported barcode & matrix standards</p>
                  </div>
                  <button className="modal-close" onClick={() => setShowFormatsInfo(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Camera Scannable (1D & 2D)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SCANNABLE_FORMATS.filter(f => f.name !== 'MaxiCode').map(f => (
                      <span key={f.id} style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '6px 12px',
                        borderRadius: 10,
                        background: f.category === '2D' ? 'rgba(88,86,214,0.1)' : 'rgba(0,122,255,0.08)',
                        color: f.category === '2D' ? '#5856D6' : '#007AFF',
                        border: `1.5px solid ${f.category === '2D' ? 'rgba(88,86,214,0.2)' : 'rgba(0,122,255,0.15)'}`
                      }}>
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Hardware Required Only</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                    {Array.from(CAMERA_UNSUPPORTED_FORMATS).map(name => (
                      <span key={name} style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '6px 12px',
                        borderRadius: 10,
                        background: 'rgba(255,149,0,0.08)',
                        color: '#FF9500',
                        border: '1px solid rgba(255,149,0,0.15)'
                      }}>
                        {name}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,149,0,0.06)', border: '1px solid rgba(255,149,0,0.15)', borderRadius: 12, padding: '10px 12px' }}>
                    <ShieldAlert size={14} style={{ color: '#FF9500', flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 11, color: '#FF9500', fontWeight: 600, lineHeight: 1.5 }}>
                      These specialized standards cannot be scanned via a standard phone camera lens. They require high-density laser decoders or industrial camera hardware.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="qrs-controls">
          <button className="qrs-side-btn" onClick={() => { triggerHapticFeedback(); stopScanner(); if (navigateTo) navigateTo('history'); else if (onBack) onBack(); }} aria-label="History">
            <Clock size={22} />
          </button>

          <button className="qrs-shutter-btn" onClick={status === 'DETECTED' ? resumeScanning : captureImage} aria-label="Shutter Button">
            <div className="qrs-shutter-btn-inner" style={{ background: status === 'DETECTED' ? '#ef4444' : '#fff' }} />
          </button>

          <button className="qrs-side-btn" onClick={() => { triggerHapticFeedback(); fileInputRef.current?.click(); }} aria-label="Gallery">
            <Image size={22} />
          </button>
        </div>

        {/* Full-Screen Detection Result */}
        {status === 'DETECTED' && qrTypeData && (
          <div className="qrs-result-fullscreen">
            {/* Header bar */}
            <div className="qrs-result-header">
              <button className="qrs-result-back-btn" onClick={resumeScanning} aria-label="Go Back">
                <ArrowLeft size={20} />
              </button>
              <h3>Scan Result</h3>
              <div className="qrs-result-header-placeholder" />
            </div>

            {/* Central content */}
            <div className="qrs-result-body">
              <div className="qrs-result-type-label">
                <TypeIcon size={14} color="var(--accent-primary)" />
                <span>{qrTypeData.title}</span>
                {detectedFormatName && (
                  <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: 'var(--accent-soft)', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{detectedFormatName}</span>
                )}
              </div>
              {/* Camera support warning for specialty formats */}
              {detectedFormatName && CAMERA_UNSUPPORTED_FORMATS.has(detectedFormatName) && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.3)', borderRadius: 12, padding: '10px 14px', margin: '4px 0' }}>
                  <ShieldAlert size={15} style={{ color: '#FF9500', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: '#FF9500', fontWeight: 600, lineHeight: 1.5 }}>⚠ This barcode type ({detectedFormatName}) is not supported by standard mobile cameras. A dedicated hardware scanner is required to decode it reliably.</span>
                </div>
              )}

              {/* Data Card */}
              <div className="qrs-result-card">
                <div className="qrs-result-data-title">Content</div>
                {qrTypeData.type === 'WiFi' ? (
                  <div className="qrs-result-wifi-fields">
                    <div className="qrs-result-wifi-row">
                      <span className="qrs-result-wifi-label">SSID</span>
                      <span className="qrs-result-wifi-value">{result.match(/S:(.*?)(?:[;]|$)/i)?.[1] || 'Unknown'}</span>
                    </div>
                    <div className="qrs-result-wifi-row">
                      <span className="qrs-result-wifi-label">Security</span>
                      <span className="qrs-result-wifi-value">{result.match(/T:(.*?)(?:[;]|$)/i)?.[1] || 'WPA'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="qrs-result-text-box">
                    {result}
                  </div>
                )}
              </div>

              {/* Secondary Actions Grid */}
              <div className="qrs-result-actions-grid">
                {qrTypeData.action !== 'Copy Text' && qrTypeData.action !== 'Copy Password' && (
                  <button className="qrs-result-act-btn" onClick={handleCopy}>
                    {copied ? <CheckCircle2 size={18} color="var(--success)" /> : <Copy size={18} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
                <button className="qrs-result-act-btn" onClick={handleShare}>
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
                <button className="qrs-result-act-btn" onClick={handleSave}>
                  <Star size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Bottom action buttons */}
            <div className="qrs-result-bottom-row">
              <button className="qrs-result-primary-btn" onClick={handlePrimaryAction}>
                <ActionIcon size={20} />
                <span>{qrTypeData.action}</span>
              </button>

              <button className="qrs-result-secondary-btn" onClick={resumeScanning}>
                <RefreshCcw size={18} />
                <span>Scan Again</span>
              </button>
            </div>
          </div>
        )}

        {/* PC Connection Modal Popup */}
        {showPcModal && (
          <div className="modal-overlay" style={{ zIndex: 11000 }} onClick={() => setShowPcModal(false)}>
            <div className="modal-container glass-panel" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Monitor size={20} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div className="modal-header-title" style={{ flex: 1 }}>
                    <h3 style={{ margin: 0 }}>PC Connection Setup</h3>
                    <p style={{ margin: 0 }}>Keyboard wedge scan relay</p>
                  </div>
                  <button className="modal-close" onClick={() => setShowPcModal(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Connection Status Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  padding: '12px 16px',
                  borderRadius: '12px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>PC Connection Status</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: pcRelayEnabled ? '#34C759' : 'var(--text-muted)'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: pcRelayEnabled ? '#34C759' : 'var(--text-muted)',
                      animation: pcRelayEnabled ? 'pulse 1.5s infinite' : 'none'
                    }} />
                    {pcRelayEnabled ? 'Relay Active' : 'Disconnected'}
                  </div>
                </div>

                {/* Switch: Connect / Relay scans to PC */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Relay Scans to PC</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Send scanned codes instantly to PC companion</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={pcRelayEnabled}
                    onChange={(e) => {
                      triggerHapticFeedback();
                      setPcRelayEnabled(e.target.checked);
                    }}
                    style={{
                      width: '42px',
                      height: '24px',
                      appearance: 'none',
                      background: 'var(--bg-hover)',
                      borderRadius: '12px',
                      position: 'relative',
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)',
                      transition: 'background 0.3s'
                    }}
                    className="pc-switch-checkbox"
                  />
                </div>

                {pcRelayEnabled && (
                  <>
                    {/* QR Code Canvas and URL info */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                      <canvas ref={qrCanvasRef} style={{ display: 'block', width: '180px', height: '180px' }} />
                      <div style={{ textAlign: 'center', color: '#000' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800 }}>Scan QR to connect PC</div>
                        <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', marginTop: '2px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                          {pcUrl}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 199, 89, 0.06)', border: '1px solid rgba(52, 199, 89, 0.15)', borderRadius: '12px', padding: '10px 12px' }}>
                      <Info size={14} style={{ color: '#34C759', flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 11, color: '#34C759', fontWeight: 600, lineHeight: 1.5 }}>
                        How to connect: Open the link above in your computer's browser or scan the QR code. Once open, click the text area to start typing.
                      </span>
                    </div>

                    {/* Prefix and Suffix configurations */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wedge Configuration</div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Append Enter Key</span>
                        <input 
                          type="checkbox" 
                          checked={appendEnter}
                          onChange={(e) => setAppendEnter(e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>Prefix</label>
                          <input 
                            type="text" 
                            value={prefix} 
                            onChange={(e) => setPrefix(e.target.value)} 
                            placeholder="e.g. ID-"
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '12px' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 600 }}>Suffix</label>
                          <input 
                            type="text" 
                            value={suffix} 
                            onChange={(e) => setSuffix(e.target.value)} 
                            placeholder="e.g. -WD"
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '12px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <input type="file" ref={fileInputRef} accept="image/*" onChange={e => handleFileUpload(e.target.files?.[0])} style={{ display: 'none' }} />
      </div>

      <style>{`
        .pc-switch-checkbox:checked {
          background: #34C759 !important;
        }
        .pc-switch-checkbox::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
        }
        .pc-switch-checkbox:checked::after {
          transform: translateX(18px);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
