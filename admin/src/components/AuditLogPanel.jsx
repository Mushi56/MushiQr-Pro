// src/components/admin/AuditLogPanel.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ClipboardList, RefreshCw, Search } from 'lucide-react';
import { T } from './AdminUIKit';

export default function AuditLogPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'global_audit_logs'), orderBy('ts', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id }));
      setLogs(list);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const q = search.toLowerCase();
    return (log.action || '').toLowerCase().includes(q) ||
           (log.actorUid || '').toLowerCase().includes(q) ||
           (log.targetUid || '').toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--ad-text)', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--ad-text)' }}>Server Audit Trails</h2>
        <button onClick={fetchLogs} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--ad-input)', border: `1px solid var(--ad-border)`, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', color: 'var(--ad-text-sec)', fontSize: 12 }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ad-text-sec)' }} />
        <input type="text" placeholder="Search by Action or Actor UID..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px 8px 32px', background: 'var(--ad-input)', border: `1px solid var(--ad-border)`, borderRadius: 8, color: 'var(--ad-text)', fontSize: 13, outline: 'none' }} />
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ad-text-sec)' }}>Loading server logs...</div>
      ) : (
        <div style={{ background: 'var(--ad-card)', border: `1px solid var(--ad-border)`, borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--ad-card-shadow)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--ad-input)', borderBottom: `1px solid var(--ad-border)`, color: 'var(--ad-text-sec)' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>Action</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Actor</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Target UID</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: `1px solid var(--ad-border)` }}>
                  <td style={{ padding: 12, fontWeight: 700, color: 'var(--ad-text)' }}>{log.action}</td>
                  <td style={{ padding: 12, fontFamily: 'monospace', color: 'var(--ad-text-sec)' }}>{log.actorUid} ({log.actorRole})</td>
                  <td style={{ padding: 12, fontFamily: 'monospace', color: 'var(--ad-text-sec)' }}>{log.targetUid || '—'}</td>
                  <td style={{ padding: 12, color: 'var(--ad-text-sec)' }}>{log.ts?.toDate ? log.ts.toDate().toLocaleString() : 'Just now'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
