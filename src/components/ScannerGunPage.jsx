import { useState, useRef, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import qrcode from 'qrcode-generator';
import {
  ArrowLeft, Wifi, Bluetooth, Cable, CheckCircle2, XCircle,
  Copy, Zap, ZapOff, History, Settings2,
  Crosshair, Monitor, ChevronRight, Loader2, Send
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

// ─── Generate session ID ──────────────────────────────────────────────────────
function genSessionId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'mqs-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// ─── Mode Tab ─────────────────────────────────────────────────────────────────
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

// ─── Step Row ─────────────────────────────────────────────────────────────────
function StepRow({ n, title, desc, color }) {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: color,
        color: '#fff', fontSize: '12px', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{n}</div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{desc}</div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ScannerGunPage({ onNavigate }) {
  // ── State ────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState('wifi');
  const [sessionId] = useState(() => genSessionId());
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
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

  // ── Refs ─────────────────────────────────────────────────────────────────
  const scannerRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const mountedRef = useRef(true);
  const cooldownRef = useRef(false);
  const lastScannedRef = useRef('');

  // ── Haptics / Sound ───────────────────────────────────────────────────────
  const haptic = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    }
  }, []);

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

  // ── Stop Scanner ──────────────────────────────────────────────────────────
  // Defined BEFORE any useEffect that references it
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

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, [stopScanner]);

  // ── Build PC companion URL ────────────────────────────────────────────────
  useEffect(() => {
    const base = window.location.origin;
    const url = `${base}/scanner-pc.html?session=${sessionId}`;
    setPcUrl(url);
  }, [sessionId]);

  // ── Render QR on canvas when URL is ready ────────────────────────────────
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

  // ── Start Scanner ─────────────────────────────────────────────────────────
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
        { fps: 15, qrbox: { width: 260, height: 160 }, aspectRatio: 1.7 },
        onScanSuccess,
        () => {}
      );
      setIsScanning(true);
      // Check torch support
      try {
        const videoEl = document.querySelector('#gun-scanner-viewport video');
        const track = videoEl?.srcObject?.getVideoTracks?.()[0];
        if (track) {
          const caps = track.getCapabilities?.() || {};
          if (caps.torch) setFlashSupported(true);
        }
      } catch (e) {}
    } catch (err) {
      console.warn('Scanner start error:', err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopScanner]);

  // ── Toggle Flash ──────────────────────────────────────────────────────────
  const toggleFlash = useCallback(async () => {
    try {
      const videoEl = document.querySelector('#gun-scanner-viewport video');
      const track = videoEl?.srcObject?.getVideoTracks?.()[0];
      if (!track) return;
      const newVal = !flashOn;
      await track.applyConstraints({ advanced: [{ torch: newVal }] });
      setFlashOn(newVal);
    } catch (e) {}
  }, [flashOn]);

  // ── On Scan Success ───────────────────────────────────────────────────────
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

    const toSend = prefix + rawData + suffix + (addEnter ? '\n' : '');

    if (!mountedRef.current) return;
    setLastScan(rawData);
    setScanTotal(prev => prev + 1);
    setScanHistory(prev => [
      { id: Date.now(), text: rawData, time: new Date() },
      ...prev.slice(0, 49)
    ]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sessionId, prefix, suffix, addEnter, haptic, playBeep]);

  // ── Copy helpers ──────────────────────────────────────────────────────────
  const copySession = () => {
    navigator.clipboard.writeText(sessionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const copyPcUrl = () => {
    navigator.clipboard.writeText(pcUrl).catch(() => {});
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
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
                padding: '1px 5px',
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

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <ModeTab id="wifi" active={mode === 'wifi'} icon={Wifi}      label="WiFi"      onClick={setMode} />
          <ModeTab id="bt"   active={mode === 'bt'}   icon={Bluetooth} label="Bluetooth" onClick={setMode} />
          <ModeTab id="usb"  active={mode === 'usb'}  icon={Cable}     label="USB"       onClick={setMode} />
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
                background: 'linear-gradient(135deg, rgba(214,0,54,0.12) 0%, rgba(0,180,120,0.06) 100%)',
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
                    background: '#00d4a0', boxShadow: '0 0 8px #00d4a0',
                  }} />
                  <span style={{ fontSize: '11px', color: '#00d4a0', fontWeight: 600 }}>Active</span>
                </div>
              </div>

              {/* QR + Instructions */}
              <div style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {/* QR Code */}
                <div style={{
                  background: '#fff', borderRadius: '12px', padding: '8px',
                  flexShrink: 0, boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                }}>
                  <canvas
                    ref={qrCanvasRef}
                    style={{ display: 'block', width: '130px', height: '130px', imageRendering: 'pixelated' }}
                  />
                </div>
                {/* Steps */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>How to connect:</div>
                  {[
                    'Scan this QR with PC camera or copy the link below',
                    'PC page opens in browser — no install needed',
                    'Start scanning barcodes on your phone',
                    'Each scan instantly types on PC ✓',
                  ].map((text, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: 'var(--accent-gradient)', color: '#fff',
                        fontSize: '9px', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '1px',
                      }}>{i + 1}</div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session ID + URL */}
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Session ID row */}
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
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Session ID</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{sessionId}</div>
                  </div>
                  <button
                    onClick={copySession}
                    style={{
                      background: copied ? 'rgba(0,212,160,0.15)' : 'var(--bg-hover)',
                      border: `1px solid ${copied ? 'rgba(0,212,160,0.3)' : 'var(--border-color)'}`,
                      borderRadius: '8px', padding: '7px 12px',
                      color: copied ? '#00d4a0' : 'var(--text-secondary)',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy ID'}
                  </button>
                </div>

                {/* PC URL */}
                <button
                  onClick={copyPcUrl}
                  title="Click to copy PC companion URL"
                  style={{
                    background: 'none', border: '1px dashed var(--border-color)',
                    borderRadius: '10px', padding: '9px 12px',
                    color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer',
                    fontFamily: 'monospace', textAlign: 'left',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    width: '100%', transition: 'all 0.2s',
                  }}
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
                borderRadius: '16px', padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: sendStatus === 'ok' ? 'rgba(0,212,160,0.15)' : sendStatus === 'err' ? 'rgba(214,0,54,0.15)' : 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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
                  <div style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px' }}>
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
              background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: '12px', padding: '12px 14px', marginBottom: '16px',
              fontSize: '12px', color: '#fbbf24', lineHeight: '1.6',
            }}>
              ⚠️ For the easiest connection, use <strong>WiFi mode</strong> — it works on any network with no pairing required.
            </div>
            {[
              { n: '1', title: 'Enable Bluetooth', desc: 'Enable Bluetooth on both phone and PC' },
              { n: '2', title: 'Pair Devices', desc: 'Pair your phone with the PC in Bluetooth settings' },
              { n: '3', title: 'Use as Input', desc: 'Set phone as Bluetooth keyboard on PC' },
              { n: '4', title: 'Scan', desc: 'Each scan is sent as keyboard input to the paired device' },
            ].map(s => <StepRow key={s.n} {...s} color="linear-gradient(135deg,#1a56db,#3b82f6)" />)}
          </div>
        )}

        {/* ── USB Mode ── */}
        {mode === 'usb' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px' }}>
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
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Wired via Android Debug Bridge</div>
              </div>
            </div>
            {[
              { n: '1', title: 'Enable USB Debugging', desc: 'Settings → Developer Options → USB Debugging → Enable' },
              { n: '2', title: 'Connect USB Cable', desc: 'Connect phone to PC with a USB data cable' },
              { n: '3', title: 'Install ADB on PC', desc: 'Download Android platform-tools from developer.android.com' },
              { n: '4', title: 'Forward Port', desc: 'Run: adb reverse tcp:7070 tcp:7070' },
              { n: '5', title: 'Open Companion', desc: 'Open http://localhost:7070/scanner-pc.html in PC browser' },
            ].map(s => <StepRow key={s.n} {...s} color="linear-gradient(135deg,#059669,#10b981)" />)}
          </div>
        )}

        {/* ── Settings Panel ── */}
        {showSettings && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Output Settings
            </div>
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
                  border: '1px solid var(--border-color)', cursor: 'pointer',
                  position: 'relative', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  position: 'absolute', top: '2px', left: addEnter ? '22px' : '2px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>
            <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Prefix</div>
              <input
                type="text" value={prefix} onChange={e => setPrefix(e.target.value)}
                placeholder="Text before barcode..."
                style={{
                  width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', padding: '8px 10px', color: 'var(--text-primary)',
                  fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ padding: '10px 0' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Suffix</div>
              <input
                type="text" value={suffix} onChange={e => setSuffix(e.target.value)}
                placeholder="Text after barcode..."
                style={{
                  width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', padding: '8px 10px', color: 'var(--text-primary)',
                  fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        )}

        {/* ── Scan History ── */}
        {showHistory && scanHistory.length > 0 && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>History ({scanHistory.length})</span>
              <button onClick={() => setScanHistory([])} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
            </div>
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {scanHistory.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.time.toLocaleTimeString()}</div>
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(item.text)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <Copy size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Camera Scanner ── */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
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
                Flash
              </button>
            )}
          </div>

          {/* Camera viewport */}
          <div style={{ position: 'relative', background: '#000', minHeight: isScanning ? '200px' : '0px' }}>
            <div id="gun-scanner-viewport" style={{ width: '100%' }} />
            {isScanning && (
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '260px', height: '120px',
                  border: '2px solid rgba(214,0,54,0.7)',
                  borderRadius: '8px',
                  boxShadow: '0 0 0 4000px rgba(0,0,0,0.35)',
                  position: 'relative', overflow: 'visible',
                }}>
                  <div style={{
                    position: 'absolute', top: '50%', left: 0, right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #d60036, transparent)',
                    animation: 'gunScanLine 2s ease-in-out infinite',
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
                borderRadius: '16px', padding: '16px',
                color: isScanning ? 'var(--text-secondary)' : '#fff',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
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

        {/* ── Stats ── */}
        {scanTotal > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { val: scanTotal, label: 'Total Scans', color: 'var(--text-primary)' },
              { val: mode === 'wifi' ? '✓' : '—', label: mode === 'wifi' ? 'Relay On' : 'Local Only', color: '#00d4a0' },
              { val: addEnter ? '↵' : '—', label: 'Enter Key', color: 'var(--text-primary)' },
            ].map(({ val, label, color }) => (
              <div key={label} style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── PC Companion Info ── */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: '16px', padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6d28d9, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Monitor size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>PC Companion</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Open <code style={{ color: 'var(--accent-color)', fontSize: '10px' }}>/scanner-pc.html</code> in your PC browser, or scan the QR above
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>

      </div>

      {/* ── Animations ── */}
      <style>{`
        @keyframes gunScanLine {
          0% { transform: translateY(-40px); opacity: 1; }
          50% { transform: translateY(40px); opacity: 1; }
          100% { transform: translateY(-40px); opacity: 1; }
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
