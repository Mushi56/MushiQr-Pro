import { useState, useRef, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import qrcode from 'qrcode-generator';
import {
  ArrowLeft, Wifi, Bluetooth, Cable, CheckCircle2, XCircle,
  Copy, RefreshCw, Zap, ZapOff, History, Settings2,
  Crosshair, Signal, SignalZero, Monitor, Smartphone,
  Plus, Minus, RotateCcw, Download, ChevronRight, Scan,
  AlertCircle, Loader2, Send
} from 'lucide-react';

// ─── Scannable barcode formats ────────────────────────────────────────────────
const ALL_SCAN_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.AZTEC,
];

// ─── Generate a random session ID ────────────────────────────────────────────
function genSessionId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'mqs-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// ─── Render QR code to canvas ────────────────────────────────────────────────
function drawQR(canvas, text, size = 200) {
  try {
    // We generate the QR pattern manually using qrcode-generator
    // eslint-disable-next-line no-undef
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    const cell = Math.floor(size / count);
    const offset = Math.floor((size - cell * count) / 2);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          ctx.fillRect(offset + c * cell, offset + r * cell, cell, cell);
        }
      }
    }
  } catch (e) {
    // Fallback: clear canvas with text
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '10px monospace';
    ctx.fillText('QR unavailable', 10, 30);
  }
}

// ─── Connection Mode Tab ──────────────────────────────────────────────────────
function ModeTab({ id, active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        padding: '10px 6px',
        background: active ? 'var(--accent-gradient)' : 'var(--bg-elevated)',
        border: active ? 'none' : '1px solid var(--border-color)',
        borderRadius: '12px',
        color: active ? '#fff' : 'var(--text-secondary)',
        fontSize: '11px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        boxShadow: active ? '0 4px 16px rgba(214,0,54,0.3)' : 'none',
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ScannerGunPage({ onNavigate }) {
  const [mode, setMode] = useState('wifi');
  const [sessionId] = useState(() => genSessionId());
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null); // 'ok' | 'err'
  const [addEnter, setAddEnter] = useState(true);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [scanTotal, setScanTotal] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pcUrl, setPcUrl] = useState('');

  const scannerRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const mountedRef = useRef(true);
  const lastScannedRef = useRef('');
  const cooldownRef = useRef(false);

  // Build PC companion URL
  useEffect(() => {
    const base = window.location.origin;
    const url = `${base}/scanner-pc.html?session=${sessionId}`;
    setPcUrl(url);
  }, [sessionId]);

  // Render QR on canvas when URL is ready
  useEffect(() => {
    if (!pcUrl || !qrCanvasRef.current) return;
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
  }, [pcUrl]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, []);

  // ── Haptics ────────────────────────────────────────────────────────────────
  const haptic = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    }
  }, []);

  // ── Beep ───────────────────────────────────────────────────────────────────
  const playBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }, []);

  // ── Stop Scanner ───────────────────────────────────────────────────────────
  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;
    if (scanner) {
      try {
        if (scanner.isScanning) await scanner.stop();
      } catch (e) {}
      scannerRef.current = null;
    }
    const vp = document.getElementById('gun-scanner-viewport');
    if (vp) vp.innerHTML = '';
    setFlashOn(false);
    setFlashSupported(false);
    setIsScanning(false);
  }, []);

  // ── Start Scanner ──────────────────────────────────────────────────────────
  const startScanner = useCallback(async () => {
    if (scannerRef.current) await stopScanner();

    try {
      const scanner = new Html5Qrcode('gun-scanner-viewport', {
        formatsToSupport: ALL_SCAN_FORMATS,
        verbose: false,
      });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 15,
          qrbox: { width: 260, height: 160 },
          aspectRatio: 1.7,
          disableFlip: false,
        },
        onScanSuccess,
        () => {}
      );

      setIsScanning(true);

      // Check torch support
      try {
        const videoEl = document.querySelector('#gun-scanner-viewport video');
        const stream = videoEl?.srcObject;
        const track = stream?.getVideoTracks?.()?.[0];
        if (track) {
          const caps = track.getCapabilities?.() || {};
          if (caps.torch) setFlashSupported(true);
        }
      } catch (e) {}
    } catch (err) {
      console.warn('Scanner start error:', err);
    }
  }, [stopScanner]);

  // ── Toggle Flash ───────────────────────────────────────────────────────────
  const toggleFlash = useCallback(async () => {
    try {
      const videoEl = document.querySelector('#gun-scanner-viewport video');
      const track = videoEl?.srcObject?.getVideoTracks?.()?.[0];
      if (!track) return;
      const newVal = !flashOn;
      await track.applyConstraints({ advanced: [{ torch: newVal }] });
      setFlashOn(newVal);
    } catch (e) {}
  }, [flashOn]);

  // ── On Scan Success ────────────────────────────────────────────────────────
  const onScanSuccess = useCallback(async (rawData) => {
    if (cooldownRef.current) return;
    if (rawData === lastScannedRef.current) return;
    cooldownRef.current = true;
    lastScannedRef.current = rawData;
    setTimeout(() => {
      cooldownRef.current = false;
      lastScannedRef.current = '';
    }, 800);

    haptic();
    playBeep();

    const processed = prefix + rawData + suffix;
    const toSend = processed + (addEnter ? '\n' : '');

    if (!mountedRef.current) return;
    setLastScan(rawData);
    setScanTotal(prev => prev + 1);
    setScanHistory(prev => [
      { id: Date.now(), text: rawData, time: new Date() },
      ...prev.slice(0, 49)
    ]);

    // Send to PC via ntfy.sh relay
    if (mode === 'wifi' && sessionId) {
      setIsSending(true);
      try {
        const resp = await fetch(`https://ntfy.sh/${sessionId}`, {
          method: 'POST',
          body: toSend,
          headers: {
            'Title': 'barcode',
            'Priority': '4',
            'Tags': 'barcode_scan',
          },
        });
        if (!mountedRef.current) return;
        setSendStatus(resp.ok ? 'ok' : 'err');
      } catch (e) {
        if (!mountedRef.current) return;
        setSendStatus('err');
      }
      setIsSending(false);
      setTimeout(() => { if (mountedRef.current) setSendStatus(null); }, 1500);
    }
  }, [mode, sessionId, prefix, suffix, addEnter, haptic, playBeep]);

  // ── Copy Session ───────────────────────────────────────────────────────────
  const copySession = () => {
    navigator.clipboard.writeText(sessionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  // ── Copy PC URL ────────────────────────────────────────────────────────────
  const copyPcUrl = () => {
    navigator.clipboard.writeText(pcUrl).catch(() => {});
  };

  const modeData = {
    wifi: { label: 'WiFi / Internet', icon: Wifi },
    bt:   { label: 'Bluetooth', icon: Bluetooth },
    usb:  { label: 'USB Wired', icon: Cable },
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      paddingBottom: '24px',
    }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px 12px',
        background: 'var(--bg-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid var(--border-color)',
      }}>
        <button
          onClick={() => { stopScanner(); onNavigate('home'); }}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}
        >
          <ArrowLeft size={22} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>Scanner Gun</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Connect to PC / Machine</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowHistory(v => !v)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', position: 'relative' }}
          >
            <History size={20} />
            {scanTotal > 0 && (
              <span style={{
                position: 'absolute', top: '-2px', right: '-4px',
                background: 'var(--accent-color)', color: '#fff',
                borderRadius: '100px', fontSize: '9px', fontWeight: 700,
                padding: '1px 5px', minWidth: '14px', textAlign: 'center',
              }}>{scanTotal}</span>
            )}
          </button>
          <button
            onClick={() => setShowSettings(v => !v)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
          >
            <Settings2 size={20} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* ── Mode Tabs ── */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.entries(modeData).map(([id, { label, icon: Icon }]) => (
            <ModeTab key={id} id={id} active={mode === id} icon={Icon} label={id === 'wifi' ? 'WiFi' : id === 'bt' ? 'Bluetooth' : 'USB'} onClick={setMode} />
          ))}
        </div>

        {/* ── WiFi Mode ── */}
        {mode === 'wifi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Session Card */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              overflow: 'hidden',
            }}>
              {/* Card header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(214,0,54,0.15) 0%, rgba(0,180,120,0.08) 100%)',
                borderBottom: '1px solid var(--border-color)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'var(--accent-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(214,0,54,0.3)',
                }}>
                  <Wifi size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>WiFi / Internet Mode</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Works on any network — no pairing needed</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#00d4a0',
                    boxShadow: '0 0 8px #00d4a0',
                    animation: 'pulse 2s infinite',
                  }} />
                  <span style={{ fontSize: '11px', color: '#00d4a0', fontWeight: 600 }}>Relay Active</span>
                </div>
              </div>

              {/* QR + Instructions */}
              <div style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {/* QR Code */}
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '10px',
                  flexShrink: 0,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                }}>
                  <canvas ref={qrCanvasRef} style={{ display: 'block', width: '140px', height: '140px', imageRendering: 'pixelated' }} />
                </div>

                {/* Instructions */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                    How to connect:
                  </div>
                  {[
                    { n: '1', text: 'Scan QR with PC camera or open the link below' },
                    { n: '2', text: 'PC companion page opens in browser' },
                    { n: '3', text: 'Start scanning barcodes on your phone' },
                    { n: '4', text: 'Each scan instantly appears & types on PC' },
                  ].map(({ n, text }) => (
                    <div key={n} style={{ display: 'flex', gap: '8px', marginBottom: '7px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: 'var(--accent-gradient)',
                        color: '#fff', fontSize: '10px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '1px',
                      }}>{n}</div>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session ID + URL */}
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Session ID</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{sessionId}</div>
                  </div>
                  <button
                    onClick={copySession}
                    style={{
                      background: copied ? 'rgba(0,212,160,0.15)' : 'var(--bg-hover)',
                      border: `1px solid ${copied ? 'rgba(0,212,160,0.3)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      padding: '7px 12px',
                      color: copied ? '#00d4a0' : 'var(--text-secondary)',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <button
                  onClick={copyPcUrl}
                  style={{
                    background: 'none',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '10px',
                    padding: '9px 12px',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    transition: 'all 0.2s',
                  }}
                  title="Click to copy PC companion URL"
                >
                  🔗 {pcUrl || 'Building URL...'}
                </button>
              </div>
            </div>

            {/* Last Scan Indicator */}
            {lastScan !== '' && (
              <div style={{
                background: 'var(--bg-card)',
                border: `1px solid ${sendStatus === 'ok' ? 'rgba(0,212,160,0.4)' : sendStatus === 'err' ? 'rgba(214,0,54,0.4)' : 'var(--border-color)'}`,
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: sendStatus === 'ok' ? 'rgba(0,212,160,0.15)' : sendStatus === 'err' ? 'rgba(214,0,54,0.15)' : 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isSending ? (
                    <Loader2 size={18} color="var(--text-secondary)" style={{ animation: 'spin 1s linear infinite' }} />
                  ) : sendStatus === 'ok' ? (
                    <CheckCircle2 size={18} color="#00d4a0" />
                  ) : sendStatus === 'err' ? (
                    <XCircle size={18} color="#ff6b8a" />
                  ) : (
                    <Send size={18} color="var(--text-secondary)" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px' }}>
                    {isSending ? 'Sending to PC...' : sendStatus === 'ok' ? 'Sent to PC ✓' : sendStatus === 'err' ? 'Send failed' : 'Last Scanned'}
                  </div>
                  <div style={{
                    fontFamily: 'monospace', fontSize: '15px', fontWeight: 700,
                    color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {lastScan}
                  </div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(lastScan)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <Copy size={15} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Bluetooth Mode ── */}
        {mode === 'bt' && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #1a56db, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
              }}>
                <Bluetooth size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Bluetooth SPP Mode</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Serial Port Profile keyboard emulation</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(251,191,36,0.08)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '16px',
              fontSize: '12px',
              color: '#fbbf24',
              lineHeight: '1.6',
            }}>
              ⚠️ Bluetooth keyboard emulation requires a native Android plugin. Use <strong>WiFi mode</strong> for instant connection without any extra setup.
            </div>

            {[
              { step: '1', title: 'Enable Bluetooth', desc: 'Enable Bluetooth on your phone and PC' },
              { step: '2', title: 'Pair Devices', desc: 'Pair your phone with the PC in Bluetooth settings' },
              { step: '3', title: 'Use Input Method', desc: 'Set phone as Bluetooth keyboard in PC Bluetooth settings' },
              { step: '4', title: 'Scan Barcodes', desc: 'Each scan is sent as keyboard input to the paired device' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a56db, #3b82f6)',
                  color: '#fff', fontSize: '12px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{step}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{desc}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              💡 For the best cross-platform experience, switch to <strong style={{ color: 'var(--text-secondary)' }}>WiFi mode</strong> which works without pairing and on any network.
            </div>
          </div>
        )}

        {/* ── USB Mode ── */}
        {mode === 'usb' && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16,185,129,0.35)',
              }}>
                <Cable size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>USB / ADB Mode</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Wired connection via Android Debug Bridge</div>
              </div>
            </div>

            {[
              { step: '1', title: 'Enable USB Debugging', desc: 'Go to Settings → Developer Options → USB Debugging → Enable' },
              { step: '2', title: 'Connect USB Cable', desc: 'Connect phone to PC with a USB data cable' },
              { step: '3', title: 'Install ADB', desc: 'Install Android Debug Bridge on PC (from platform-tools)' },
              { step: '4', title: 'Forward Port', desc: 'Run: adb reverse tcp:7070 tcp:7070' },
              { step: '5', title: 'Open Companion', desc: 'Open http://localhost:7070/scanner-pc.html on PC browser' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#fff', fontSize: '12px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{step}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: desc.startsWith('Run:') ? 'monospace' : 'inherit' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Settings Panel ── */}
        {showSettings && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Output Settings
            </div>
            {/* Add Enter toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Append Enter Key</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Auto-confirm / move to next field on PC</div>
              </div>
              <button
                onClick={() => setAddEnter(v => !v)}
                style={{
                  width: '44px', height: '24px', borderRadius: '12px',
                  background: addEnter ? 'var(--accent-color)' : 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  position: 'absolute', top: '2px',
                  left: addEnter ? '22px' : '2px',
                  width: '18px', height: '18px',
                  borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>
            {/* Prefix */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Prefix</div>
                <input
                  type="text"
                  value={prefix}
                  onChange={e => setPrefix(e.target.value)}
                  placeholder="Text before barcode..."
                  style={{
                    width: '100%', background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)', borderRadius: '8px',
                    padding: '8px 10px', color: 'var(--text-primary)',
                    fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
            {/* Suffix */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Suffix</div>
                <input
                  type="text"
                  value={suffix}
                  onChange={e => setSuffix(e.target.value)}
                  placeholder="Text after barcode..."
                  style={{
                    width: '100%', background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)', borderRadius: '8px',
                    padding: '8px 10px', color: 'var(--text-primary)',
                    fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Scan History Panel ── */}
        {showHistory && scanHistory.length > 0 && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Scan History ({scanHistory.length})</span>
              <button
                onClick={() => setScanHistory([])}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Clear
              </button>
            </div>
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {scanHistory.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 16px', borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.text}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.time.toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.text)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Copy size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Camera Scanner Section ── */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Camera Scanner</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {isScanning ? 'Scanning — point at barcode or QR...' : 'Tap Start to begin scanning'}
              </div>
            </div>
            {isScanning && flashSupported && (
              <button
                onClick={toggleFlash}
                style={{
                  background: flashOn ? 'rgba(251,191,36,0.15)' : 'var(--bg-elevated)',
                  border: `1px solid ${flashOn ? 'rgba(251,191,36,0.4)' : 'var(--border-color)'}`,
                  borderRadius: '10px', padding: '8px 12px',
                  color: flashOn ? '#fbbf24' : 'var(--text-secondary)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                }}
              >
                {flashOn ? <Zap size={14} /> : <ZapOff size={14} />}
                {flashOn ? 'Flash On' : 'Flash'}
              </button>
            )}
          </div>

          {/* Camera viewport */}
          <div style={{ position: 'relative', background: '#000', minHeight: isScanning ? '220px' : '0px' }}>
            <div id="gun-scanner-viewport" style={{ width: '100%' }} />
            {isScanning && (
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* Scan guide overlay */}
                <div style={{
                  width: '260px', height: '120px', border: '2px solid rgba(214,0,54,0.7)',
                  borderRadius: '8px', boxShadow: '0 0 0 4000px rgba(0,0,0,0.35)',
                }}>
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: '260px', height: '2px',
                    background: 'linear-gradient(90deg, transparent, #d60036, transparent)',
                    animation: 'scanLine 2s ease-in-out infinite',
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Scan button */}
          <div style={{ padding: '14px 16px' }}>
            <button
              onClick={isScanning ? stopScanner : startScanner}
              style={{
                width: '100%',
                background: isScanning ? 'var(--bg-elevated)' : 'var(--accent-gradient)',
                border: isScanning ? '1px solid var(--border-color)' : 'none',
                borderRadius: '16px',
                padding: '16px',
                color: isScanning ? 'var(--text-secondary)' : '#fff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontFamily: 'inherit',
                boxShadow: isScanning ? 'none' : '0 6px 20px rgba(214,0,54,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {isScanning ? (
                <><XCircle size={18} /> Stop Scanning</>
              ) : (
                <><Crosshair size={18} /> Start Scanning</>
              )}
            </button>
          </div>
        </div>

        {/* ── Scan Stats ── */}
        {scanTotal > 0 && (
          <div style={{
            display: 'flex', gap: '10px',
          }}>
            <div style={{
              flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '14px', padding: '12px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{scanTotal}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Total Scans</div>
            </div>
            <div style={{
              flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '14px', padding: '12px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#00d4a0' }}>
                {mode === 'wifi' ? '✓' : '—'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {mode === 'wifi' ? 'Relay On' : 'Local Only'}
              </div>
            </div>
            <div style={{
              flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '14px', padding: '12px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {addEnter ? '↵' : '—'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Enter Key</div>
            </div>
          </div>
        )}

        {/* ── Download Companion ── */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6d28d9, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Monitor size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>PC Companion App</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Open <code style={{ color: 'var(--accent-color)', fontSize: '10px' }}>/scanner-pc.html</code> on your PC browser, or use the QR above
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>

      </div>

      {/* ── Scan Line Animation ── */}
      <style>{`
        @keyframes scanLine {
          0% { top: 20%; }
          50% { top: 80%; }
          100% { top: 20%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        #gun-scanner-viewport video {
          width: 100% !important;
          height: auto !important;
        }
        #gun-scanner-viewport > div {
          border: none !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
