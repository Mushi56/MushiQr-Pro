// src/components/admin/TransactionsManager.jsx
// â”€â”€â”€ Payment Transactions Ledger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Displays immutable historical payment events from payment_transactions.

import React, { useState, useEffect } from 'react';
import { CreditCard, Search, ArrowUpRight, ArrowDownLeft, RefreshCw, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { T } from './AdminUIKit';

export default function TransactionsManager() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');

  useEffect(() => {
    const q = query(collection(db, 'payment_transactions'), limit(100));
    return onSnapshot(q, snap => {
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(list);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const filtered = transactions.filter(t => {
    const matchSearch = !search ||
      t.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      t.userId?.toLowerCase().includes(search.toLowerCase()) ||
      t.provider?.toLowerCase().includes(search.toLowerCase()) ||
      t.productId?.toLowerCase().includes(search.toLowerCase());
    
    const matchEvent = eventFilter === 'ALL' || t.eventType === eventFilter;
    return matchSearch && matchEvent;
  });

  const fmtDate = (d) => {
    if (!d) return 'â€”';
    try {
      const date = d.toDate ? d.toDate() : new Date(d);
      return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(d);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.bgCard, padding: '18px 22px', borderRadius: T.r.lg, border: `1px solid ${T.border}`, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CreditCard size={20} color={T.accent} /> Payment Transactions Ledger
          </h2>
          <p style={{ fontSize: 12, color: T.textSec, margin: '4px 0 0' }}>
            Authoritative, append-only historical record of all store purchases, web checkouts, and renewals.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', padding: '8px 14px', borderRadius: 10, border: `1px solid ${T.border}`, flex: 1, minWidth: 220 }}>
          <Search size={14} color="#8b8fa8" />
          <input
            type="text"
            placeholder="Search by Transaction ID, User UID, or Product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: 12, width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['ALL', 'INITIAL_PURCHASE', 'RENEWAL', 'CANCEL', 'REFUND'].map(ev => (
            <button
              key={ev}
              onClick={() => setEventFilter(ev)}
              style={{
                background: eventFilter === ev ? 'rgba(214,0,54,0.15)' : 'rgba(255,255,255,0.03)',
                color: eventFilter === ev ? T.accent : T.textSec,
                border: `1px solid ${eventFilter === ev ? T.accent : T.border}`,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {ev}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ background: T.bgCard, borderRadius: T.r.lg, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 680 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${T.border}` }}>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Transaction ID</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>User UID</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Event Type</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Provider</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Product ID</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: T.textSec, fontSize: 13 }}>
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map(txn => (
                  <tr key={txn.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontSize: 12, color: '#fff' }}>
                      {txn.transactionId || txn.id}
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontSize: 12, color: T.textSec }}>
                      {txn.userId || 'â€”'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: txn.eventType === 'INITIAL_PURCHASE' || txn.eventType === 'RENEWAL' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: txn.eventType === 'INITIAL_PURCHASE' || txn.eventType === 'RENEWAL' ? '#10b981' : '#ef4444'
                      }}>
                        {txn.eventType || 'PURCHASE'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 12, color: T.textSec }}>
                      {txn.provider || 'google_play'}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 12, color: '#fff' }}>
                      {txn.productId || 'â€”'}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 12, color: T.textSec }}>
                      {fmtDate(txn.processedAt || txn.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
