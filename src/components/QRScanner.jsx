import { useState, useRef, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import {
  ArrowLeft, Zap, ZapOff, Image, CheckCircle2,
  Copy, ExternalLink, Share2, Star, Wifi, Mail,
  Phone, User, Globe, FileText, Minus, Plus, AlertCircle, RefreshCcw, Clock
} from 'lucide-react';
import { generateQRMatrix, renderQR } from '../utils/qrEngine';
import qrNotFoundSvg from '../assets/qr-not-found.svg';

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

// Dynamically load QrScanner CDN
const loadQrScanner = async () => {
  if (window.QrScanner) return window.QrScanner;
  try {
    const module = await import('https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.min.js');
    const QrScannerLib = module.default;
    QrScannerLib.WORKER_PATH = 'https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner-worker.min.js';
    window.QrScanner = QrScannerLib;
    return QrScannerLib;
  } catch (err) {
    throw new Error('Failed to load QR scanner library.');
  }
};

export default function QRScanner({ onBack, navigateTo }) {
  const [status, setStatus] = useState('SCANNING');
  const [result, setResult] = useState(null);
  const [qrTypeData, setQrTypeData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [facingBack, setFacingBack] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomCapabilities, setZoomCapabilities] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const qrScannerRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);
  const busyRef = useRef(false);
  const touchStateRef = useRef({ distance: 0, initialZoom: 1 });
  const capTimersRef = useRef([]);
  const zoomRafRef = useRef(null);

  const triggerHapticFeedback = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
    }
  }, []);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const stopScanner = useCallback(async () => {
    busyRef.current = false;
    const scanner = qrScannerRef.current;
    if (scanner) {
      try {
        scanner.destroy();
      } catch (e) {
        console.warn('Error destroying scanner:', e);
      }
      qrScannerRef.current = null;
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
    if (!videoRef.current) return;
    try {
      const stream = videoRef.current.srcObject;
      const track = stream?.getVideoTracks()?.[0];
      if (track) {
        const caps = track.getCapabilities();
        const minVal = caps.zoom?.min || 1;
        const maxVal = caps.zoom?.max || 8;
        const val = Math.min(Math.max(value, minVal), maxVal);
        try {
          await track.applyConstraints({ advanced: [{ zoom: val }] });
        } catch { }
        setZoom(val);
      }
    } catch { }
  }, []);

  const toggleFlash = useCallback(async () => {
    triggerHapticFeedback();
    const scanner = qrScannerRef.current;
    if (!scanner) return;
    const next = !flashOn;
    try {
      if (next) {
        await scanner.turnFlashOn();
      } else {
        await scanner.turnFlashOff();
      }
      setFlashOn(next);
    } catch (err) {
      console.error('Flash toggle error:', err);
    }
  }, [flashOn, triggerHapticFeedback]);

  const handleScanResult = useCallback((decodedText) => {
    if (!mountedRef.current || busyRef.current) return;
    setStatus(prev => {
      if (prev === 'DETECTED') return prev;
      if (Capacitor.isNativePlatform()) { Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => { }); }
      else if (navigator.vibrate) { navigator.vibrate(200); }

      const scanner = qrScannerRef.current;
      if (scanner) {
        try { scanner.pause(); } catch { }
      }

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
          type: parsed.type.toUpperCase(),
          displayText: decodedText,
          thumbnail: thumbnail
        });
      });
      return 'DETECTED';
    });
  }, []);

  const startScanner = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    if (!mountedRef.current) return;
    setResult(null); setQrTypeData(null); setError(null); setStatus('SCANNING'); setZoom(1); setVideoPlaying(false);
    try {
      await stopScanner();
      if (!mountedRef.current) { busyRef.current = false; return; }

      const QrScannerLib = await loadQrScanner();
      if (!mountedRef.current) { busyRef.current = false; return; }
      if (!videoRef.current) throw new Error('Video element not found.');

      const scanner = new QrScannerLib(
        videoRef.current,
        (res) => {
          const text = typeof res === 'object' ? res.data : res;
          handleScanResult(text);
        },
        {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          maxScansPerSecond: 10,
          videoConstraints: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        }
      );

      qrScannerRef.current = scanner;
      await scanner.start();

      if (!mountedRef.current) { busyRef.current = false; return; }
      capTimersRef.current.forEach(clearTimeout);
      capTimersRef.current = [];

      const checkCapabilities = () => {
        try {
          const stream = videoRef.current?.srcObject;
          const track = stream?.getVideoTracks()?.[0];
          if (track) {
            const caps = track.getCapabilities();
            if (caps.zoom) {
              setZoomCapabilities({
                min: caps.zoom.min || 1,
                max: Math.min(caps.zoom.max || 10, 10),
                step: caps.zoom.step || 0.1
              });
              setZoom(prev => prev === 1 ? (caps.zoom.min || 1) : prev);
            } else {
              // Fallback zoom capabilities so the slider is always rendered in WebViews
              setZoomCapabilities({
                min: 1,
                max: 8,
                step: 0.1
              });
            }
            scanner.hasFlash().then(hasFlash => {
              if (hasFlash || (Capacitor.isNativePlatform() && facingBack)) {
                setFlashSupported(true);
              }
            }).catch(() => {
              if (Capacitor.isNativePlatform() && facingBack) {
                setFlashSupported(true);
              }
            });
          }
        } catch (e) {
          console.warn('Failed to check capabilities:', e);
          if (Capacitor.isNativePlatform() && facingBack) {
            setFlashSupported(true);
          }
        }
      };

      checkCapabilities();
      const t1 = setTimeout(checkCapabilities, 500);
      const t2 = setTimeout(checkCapabilities, 1000);
      const t3 = setTimeout(checkCapabilities, 2000);
      capTimersRef.current.push(t1, t2, t3);

      busyRef.current = false;
      setStatus('SCANNING');
    } catch (err) {
      busyRef.current = false;
      if (!mountedRef.current) return;
      let msg = 'Failed to start camera.';
      const m = typeof err?.message === 'string' ? err.message : '';
      if (m.includes('NotAllowed') || m.includes('Permission')) msg = 'Camera permission denied. Please allow camera access in Settings.';
      else if (m.includes('NotReadable') || m.includes('in use')) msg = 'Camera is in use by another app.';
      else if (m.includes('NotFound')) msg = 'No camera found on this device.';
      else if (m) msg = m;
      setError(msg); setStatus('ERROR'); await stopScanner();
    }
  }, [facingBack, stopScanner, handleScanResult]);

  useEffect(() => { const t = setTimeout(() => { if (mountedRef.current) startScanner(); }, 200); return () => clearTimeout(t); }, []); // eslint-disable-line

  const handleFileUpload = async (file) => {
    if (!file) return;
    await stopScanner(); setStatus('LOADING'); setResult(null); setQrTypeData(null); setError(null);
    try {
      const QrScannerLib = await loadQrScanner();
      const res = await QrScannerLib.scanImage(file, { returnDetailedScanResult: true });
      const text = typeof res === 'object' ? res.data : res;
      if (mountedRef.current) handleScanResult(text);
    } catch {
      if (mountedRef.current) { setError('No QR code found in this image.'); setStatus('ERROR'); }
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
    setResult(null); setQrTypeData(null); setStatus('SCANNING');
  };

  const captureImage = useCallback(async () => {
    triggerHapticFeedback();
    const video = videoRef.current;
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
          const QrScannerLib = await loadQrScanner();
          const res = await QrScannerLib.scanImage(file, { returnDetailedScanResult: true });
          const text = typeof res === 'object' ? res.data : res;
          if (mountedRef.current) {
            handleScanResult(text);
          }
        } catch {
          if (mountedRef.current) {
            setError('No QR code found in the captured image.');
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
        {/* Header */}
        <header className="qrs-header">
          <div className="qrs-header-left">
            <button className="qrs-icon-btn" onClick={safeBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="qrs-body" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>


          {/* Scanner Frame */}
          <div className={`qrs-frame ${status === 'DETECTED' ? 'detected' : ''}`}>
            {/* 3:4 Ratio Frame Viewport */}
            <div id="qr-scanner-viewport" className={`qrs-viewport ${status === 'DETECTED' ? 'blur' : ''}`}>
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: videoPlaying ? 1 : 0,
                  visibility: videoPlaying ? 'visible' : 'hidden',
                  transition: 'opacity 0.2s ease-in-out',
                }}
                muted
                playsInline
                autoPlay
                onPlay={() => setVideoPlaying(true)}
                onPlaying={() => setVideoPlaying(true)}
              />
            </div>

            {/* Error - QR Not Found (illustrated) */}
            {status === 'ERROR' && error && error.toLowerCase().includes('no qr') ? (
              <div className="qrs-no-qr-screen">
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
              <div className="qrs-center-msg">
                <AlertCircle size={44} color="#ef4444" />
                <p>{error}</p>
                <button className="qrs-retry-btn" onClick={startScanner}><RefreshCcw size={16} /> Try Again</button>
              </div>
            ) : null}

            {/* Flashlight button inside camera */}
            {flashSupported && (
              <button className={`qrs-flash-viewport-btn ${flashOn ? 'on' : ''}`} onClick={toggleFlash} aria-label="Toggle flash">
                {flashOn ? <Zap size={22} /> : <ZapOff size={22} />}
              </button>
            )}

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

        {/* Mode Selector Tabs */}
        <div className="qrs-mode-selector">
          <div className="qrs-mode-tab active">
            Scan
            <div className="qrs-mode-dot" />
          </div>
        </div>

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
              </div>

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

        <input type="file" ref={fileInputRef} accept="image/*" onChange={e => handleFileUpload(e.target.files?.[0])} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
