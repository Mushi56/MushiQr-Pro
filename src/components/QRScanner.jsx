import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import {
  ArrowLeft, Zap, ZapOff, Image, X, CheckCircle2,
  Copy, ExternalLink, Share2, Star, Wifi, Mail,
  Phone, User, Globe, FileText, Link2, ScanLine,
  ShieldCheck, Minus, Plus, AlertCircle, RefreshCcw, Bookmark,
  History, Settings, Clock
} from 'lucide-react';
import { generateQRMatrix, renderQR } from '../utils/qrEngine';


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

export default function QRScanner({ onBack, navigateTo }) {
  const [status, setStatus] = useState('LOADING');
  const [result, setResult] = useState(null);
  const [qrTypeData, setQrTypeData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [facingBack, setFacingBack] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomCapabilities, setZoomCapabilities] = useState(null);

  const html5QrRef = useRef(null);
  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);
  const busyRef = useRef(false);
  const touchStateRef = useRef({ distance: 0, initialZoom: 1 });
  const capTimersRef = useRef([]);
  const zoomRafRef = useRef(null);

  const triggerHapticFeedback = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    }
  }, []);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    return () => {
      const qr = html5QrRef.current;
      if (qr) { try { if (qr.isScanning) qr.stop().catch(() => {}); } catch {} try { qr.clear(); } catch {} html5QrRef.current = null; }
    };
  }, []);

  const stopScanner = useCallback(async () => {
    busyRef.current = false;
    const qr = html5QrRef.current;
    if (!qr) return;
    try { if (qr._controlsObserver) qr._controlsObserver.disconnect(); } catch {}
    try { if (qr.isScanning) await qr.stop(); } catch {}
    try { qr.clear(); } catch {}
    html5QrRef.current = null;
    setZoomCapabilities(null);
    setFlashOn(false);
    setFlashSupported(false);
    capTimersRef.current.forEach(clearTimeout);
    capTimersRef.current = [];
  }, []);

  const safeBack = useCallback(() => { triggerHapticFeedback(); stopScanner(); if (onBack) onBack(); }, [stopScanner, onBack, triggerHapticFeedback]);

  const applyZoom = useCallback(async (value) => {
    const qr = html5QrRef.current;
    if (!qr || !qr.isScanning) return;
    try {
      const track = qr.getRunningTrack();
      if (track) {
        const caps = track.getCapabilities();
        if (caps.zoom) {
          const val = Math.min(Math.max(value, caps.zoom.min), caps.zoom.max);
          await track.applyConstraints({ advanced: [{ zoom: val }] });
          setZoom(val);
        }
      }
    } catch {}
  }, []);

  const toggleFlash = useCallback(async () => {
    triggerHapticFeedback();
    const qr = html5QrRef.current;
    const next = !flashOn;
    
    try {
      if (!qr || !qr.isScanning) return;
      const track = qr.getRunningTrack();
      if (track) {
        // Try multiple constraints format sequentially to maximize compatibility on mobile WebViews
        const constraintSequences = [
          { advanced: [{ torch: next }] },
          { advanced: [{ fillLightMode: next ? 'torch' : 'off' }] }
        ];
        
        let success = false;
        for (const constraints of constraintSequences) {
          try {
            await track.applyConstraints(constraints);
            success = true;
            break;
          } catch (e) {
            console.warn('Failed to apply constraints:', constraints, e);
          }
        }
        
        if (success) {
          setFlashOn(next);
        }
      }
    } catch (err) {
      console.error('Flash toggle error:', err);
    }
  }, [flashOn]);

  const handleScanResult = useCallback((decodedText) => {
    if (!mountedRef.current || busyRef.current) return;
    setStatus(prev => {
      if (prev === 'DETECTED') return prev;
      if (Capacitor.isNativePlatform()) { Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {}); }
      else if (navigator.vibrate) { navigator.vibrate(200); }
      const qr = html5QrRef.current;
      if (qr && qr.isScanning) { try { qr.pause(true); } catch {} }
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
    setResult(null); setQrTypeData(null); setError(null); setStatus('LOADING'); setZoom(1);
    try {
      await stopScanner();
      await new Promise(r => setTimeout(r, 50));
      if (!mountedRef.current) { busyRef.current = false; return; }
      const el = document.getElementById('qr-scanner-viewport');
      if (!el) throw new Error('Scanner viewport not found.');
      el.innerHTML = '';
      const html5Qr = new Html5Qrcode('qr-scanner-viewport');
      html5QrRef.current = html5Qr;
      const el2 = document.getElementById('qr-scanner-viewport');
      const vw = el2?.clientWidth || 320;
      const vh = el2?.clientHeight || 427;
      const config = {
        fps: 10, // decode tick rate only — camera renders at native framerate
        qrbox: { width: Math.floor(vw * 0.82), height: Math.floor(vh * 0.82) },
        aspectRatio: 0.75, // 3:4 ratio
        disableFlip: false,
        videoConstraints: {
          facingMode: facingBack ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 960 },
          aspectRatio: { ideal: 0.75 }
        }
      };
      await html5Qr.start({ facingMode: facingBack ? 'environment' : 'user' }, config, (t) => handleScanResult(t), () => {});
      if (!mountedRef.current) { busyRef.current = false; return; }
      capTimersRef.current.forEach(clearTimeout);
      capTimersRef.current = [];

      const checkCapabilities = () => {
        try {
          const track = html5QrRef.current?.getRunningTrack();
          if (track) {
            const caps = track.getCapabilities();
            if (caps.zoom) {
              setZoomCapabilities({
                min: caps.zoom.min || 1,
                max: Math.min(caps.zoom.max || 10, 10),
                step: caps.zoom.step || 0.1
              });
              setZoom(prev => prev === 1 ? (caps.zoom.min || 1) : prev);
            }
            if (caps.torch || (Capacitor.isNativePlatform() && facingBack)) {
              setFlashSupported(true);
            }
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
      try {
        const vp = document.getElementById('qr-scanner-viewport');
        if (vp) {
          const strip = (c) => { c.querySelectorAll('video').forEach(v => { v.removeAttribute('controls'); v.controls = false; v.setAttribute('playsinline', ''); v.setAttribute('disablepictureinpicture', ''); v.style.pointerEvents = 'none'; }); };
          strip(vp);
          const obs = new MutationObserver(() => strip(vp));
          obs.observe(vp, { childList: true, subtree: true, attributes: true, attributeFilter: ['controls'] });
          html5Qr._controlsObserver = obs;
        }
      } catch {}
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
    try { const qr = new Html5Qrcode('qr-scanner-file-temp'); const text = await qr.scanFile(file, true); if (mountedRef.current) handleScanResult(text); }
    catch { if (mountedRef.current) { setError('No QR code found in this image.'); setStatus('ERROR'); } }
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
    catch { if (navigator.share) navigator.share({ title: 'Scanned QR Code', text: result }).catch(() => {}); }
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
    const qr = html5QrRef.current;
    if (qr && qr.isPaused) { try { qr.resume(); } catch {} } else { startScanner(); }
    setResult(null); setQrTypeData(null); setStatus('SCANNING');
  };

  const captureImage = useCallback(async () => {
    triggerHapticFeedback();
    const video = document.querySelector('#qr-scanner-viewport video');
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
          const qr = new Html5Qrcode('qr-scanner-file-temp');
          const text = await qr.scanFile(file, true);
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
      if (zoomRafRef.current) return; // throttle to one rAF per frame
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



          {/* Error */}
          {status === 'ERROR' && (
            <div className="qrs-center-msg">
              <AlertCircle size={44} color="#ef4444" />
              <p>{error}</p>
              <button className="qrs-retry-btn" onClick={startScanner}><RefreshCcw size={16} /> Try Again</button>
            </div>
          )}

          {/* Scanner Frame */}
          <div className={`qrs-frame ${status === 'DETECTED' ? 'detected' : ''}`}>
            {/* 3:4 Ratio Frame Viewport */}
            <div id="qr-scanner-viewport" className={`qrs-viewport ${status === 'DETECTED' ? 'blur' : ''}`} />

            {/* Flashlight button inside camera */}
            <button className={`qrs-flash-viewport-btn ${flashOn ? 'on' : ''}`} onClick={toggleFlash} aria-label="Toggle flash">
              {flashOn ? <Zap size={22} /> : <ZapOff size={22} />}
            </button>

            {/* Laser Scanning Line */}
            {status === 'SCANNING' && <div className="qrs-laser" />}
            {status === 'DETECTED' && <div className="qrs-laser frozen" />}
          </div>


          {/* Zoom */}
          {status === 'SCANNING' && zoomCapabilities && (
            <div className="qrs-zoom">
              <button onClick={() => applyZoom(zoom - 0.5)}><Minus size={14} /></button>
              <input type="range" min={zoomCapabilities.min} max={zoomCapabilities.max} step={zoomCapabilities.step} value={zoom} onChange={e => applyZoom(parseFloat(e.target.value))} />
              <button onClick={() => applyZoom(zoom + 0.5)}><Plus size={14} /></button>
              <span>{zoom.toFixed(1)}x</span>
            </div>
          )}
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

        {/* Detection Bottom Sheet */}
        {status === 'DETECTED' && qrTypeData && (
          <div className="qrs-sheet-bg" onClick={resumeScanning}>
            <div className="qrs-sheet" onClick={e => e.stopPropagation()}>
              <div className="qrs-sheet-handle" />
              <div className="qrs-sheet-head">
                <CheckCircle2 size={22} color="#ef4444" />
                <h3>QR Detected</h3>
              </div>
              <div className="qrs-sheet-type">
                <TypeIcon size={14} />
                <span>{qrTypeData.title}</span>
              </div>
              
              {/* Type-Specific Preview Card */}
              {qrTypeData.type === 'WiFi' ? (
                <div className="qrs-type-card-wifi">
                  <div className="qrs-type-card-wifi-field">
                    <span className="qrs-type-card-wifi-lbl">SSID</span>
                    <span className="qrs-type-card-wifi-val">{result.match(/S:(.*?)(?:[;]|$)/i)?.[1] || 'Unknown'}</span>
                  </div>
                  <div className="qrs-type-card-wifi-field">
                    <span className="qrs-type-card-wifi-lbl">Security</span>
                    <span className="qrs-type-card-wifi-val">{result.match(/T:(.*?)(?:[;]|$)/i)?.[1] || 'WPA'}</span>
                  </div>
                </div>
              ) : (
                <div className="qrs-sheet-preview">
                  <div className="qrs-sheet-link-icon">
                    <TypeIcon size={20} />
                  </div>
                  <div className="qrs-sheet-link-text">
                    <p className="qrs-sheet-url">{result}</p>
                  </div>
                </div>
              )}

              <div className="qrs-sheet-actions">
                <button className="qrs-sheet-act primary" onClick={handlePrimaryAction}>
                  <ActionIcon size={20} />
                  <span>{qrTypeData.action}</span>
                </button>
                <button className="qrs-sheet-act" onClick={handleCopy}>
                  {copied ? <CheckCircle2 size={18} color="#ef4444" /> : <Copy size={18} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button className="qrs-sheet-act" onClick={handleShare}>
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
                <button className="qrs-sheet-act" onClick={handleSave}>
                  <Star size={18} />
                  <span>Save</span>
                </button>
              </div>
              
              <button 
                className="qrs-retry-btn" 
                style={{ width: '100%', marginTop: '16px', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' }} 
                onClick={resumeScanning}
              >
                <RefreshCcw size={14} /> Resume Scanning
              </button>
            </div>
          </div>
        )}

        <input type="file" ref={fileInputRef} accept="image/*" onChange={e => handleFileUpload(e.target.files?.[0])} style={{ display: 'none' }} />
        <div id="qr-scanner-file-temp" style={{ display: 'none' }} />
      </div>
    </div>
  );
}
