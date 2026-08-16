// src/components/admin/SubscribersManager.jsx
// â”€â”€â”€ Subscribers & Manual Entitlements Manager â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Real-time table of user subscriptions, status filtering, and Super Admin manual grant modal.

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Crown, CheckCircle2, XCircle, Clock, 
  Shield, Edit3, Trash2, Calendar, UserPlus, Filter, AlertTriangle, X
} from 'lucide-react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db, functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';
import { T } from './AdminUIKit';

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Grant Modal
  const [grantModal, setGrantModal] = useState(false);
  const [targetUid, setTargetUid] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [durationDays, setDurationDays] = useState(30);
  const [grantReason, setGrantReason] = useState('');
  const [granting, setGranting] = useState(false);
  const [grantMsg, setGrantMsg] = useState(null);

  // Subscribe to user_subscriptions
  useEffect(() => {
    const q = query(collection(db, 'user_subscriptions'), limit(200));
    return onSnapshot(q, snap => {
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setSubscribers(list);
      setLoading(false);
    }, () => setLoading(false));
  }, []);

  const filteredSubscribers = subscribers.filter(sub => {
    const matchSearch = !search || 
      sub.userId?.toLowerCase().includes(search.toLowerCase()) || 
      sub.id?.toLowerCase().includes(search.toLowerCase()) ||
      sub.provider?.toLowerCase().includes(search.toLowerCase());
    
    const status = (sub.status || 'FREE').toUpperCase();
    const matchStatus = statusFilter === 'ALL' || status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleManualGrant = async () => {
    if (!targetUid.trim()) return;
    setGranting(true);
    setGrantMsg(null);
    try {
      const grantFn = httpsCallable(functions, 'updateUserSubscription');
      await grantFn({
        targetUid: targetUid.trim(),
        planId: selectedPlan,
        isPro: selectedPlan !== 'free',
        durationDays: selectedPlan === 'lifetime' ? null : Number(durationDays),
        reason: grantReason.trim() || 'Admin Manual Grant'
      });

      setGrantMsg({ type: 'success', text: `Successfully updated subscription for UID: ${targetUid}` });
      setTimeout(() => {
        setGrantModal(false);
        setGrantMsg(null);
        setTargetUid('');
        setGrantReason('');
      }, 2000);
    } catch (e) {
      setGrantMsg({ type: 'error', text: 'Error granting entitlement: ' + e.message });
    } finally {
      setGranting(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return 'â€”';
    try {
      const date = d.toDate ? d.toDate() : new Date(d);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return String(d);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: '#fff' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.bgCard, padding: '18px 22px', borderRadius: T.r.lg, border: `1px solid ${T.border}`, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={20} color={T.accent} /> Subscribers &amp; User Entitlements
          </h2>
          <p style={{ fontSize: 12, color: T.textSec, margin: '4px 0 0' }}>
            Inspect active user memberships, verify payment providers, and grant manual administrative subscriptions.
          </p>
        </div>

        <button
          onClick={() => setGrantModal(true)}
          style={{
            background: T.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '9px 18px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <UserPlus size={14} /> Grant Premium
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', padding: '8px 14px', borderRadius: 10, border: `1px solid ${T.border}`, flex: 1, minWidth: 220 }}>
          <Search size={14} color="#8b8fa8" />
          <input
            type="text"
            placeholder="Search by User UID or Provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: 12, width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['ALL', 'ACTIVE', 'TRIAL', 'GRACE_PERIOD', 'CANCELLED', 'EXPIRED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? 'rgba(214,0,54,0.15)' : 'rgba(255,255,255,0.03)',
                color: statusFilter === st ? T.accent : T.textSec,
                border: `1px solid ${statusFilter === st ? T.accent : T.border}`,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Subscribers Table */}
      <div style={{ background: T.bgCard, borderRadius: T.r.lg, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 680 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${T.border}` }}>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>User UID</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Plan Tier</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Provider</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase' }}>Expiry Date</th>
                <th style={{ padding: '12px 18px', fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: T.textSec, fontSize: 13 }}>
                    No subscription records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map(sub => {
                  const status = (sub.status || (sub.isPro ? 'ACTIVE' : 'FREE')).toUpperCase();
                  const isGold = status === 'ACTIVE' || status === 'TRIAL';

                  return (
                    <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                          {sub.userId || sub.id}
                        </div>
                        {sub.grantReason && (
                          <div style={{ fontSize: 10, color: T.textSec, marginTop: 2 }}>Reason: {sub.grantReason}</div>
                        )}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'capitalize', color: sub.planId === 'yearly' ? '#D60036' : sub.planId === 'monthly' ? '#3b82f6' : '#fff' }}>
                          {sub.planId || (sub.isPro ? 'Pro' : 'Free')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: isGold ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          color: isGold ? '#10b981' : '#ef4444'
                        }}>
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12, color: T.textSec }}>
                        {sub.provider || 'system'}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 12, color: T.textSec }}>
                        {sub.expiryDate ? fmtDate(sub.expiryDate) : (sub.planId === 'lifetime' ? 'Lifetime' : 'â€”')}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setTargetUid(sub.userId || sub.id);
                            setSelectedPlan(sub.planId || 'monthly');
                            setGrantModal(true);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: `1px solid ${T.border}`,
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Modify
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant / Modify Premium Modal */}
      {grantModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 480, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${T.border}` }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Grant or Modify Subscription</h3>
              <button onClick={() => setGrantModal(false)} style={{ background: 'none', border: 'none', color: T.textSec, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {grantMsg && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: grantMsg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: grantMsg.type === 'success' ? '#10b981' : '#ef4444', fontSize: 12, fontWeight: 700 }}>
                  {grantMsg.text}
                </div>
              )}

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Target User UID</label>
                <input
                  type="text"
                  placeholder="Paste Firebase Auth User UID"
                  value={targetUid}
                  onChange={e => setTargetUid(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Plan Tier</label>
                  <select
                    value={selectedPlan}
                    onChange={e => setSelectedPlan(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }}
                  >
                    <option value="weekly">Weekly Pass</option>
                    <option value="monthly">Monthly Pro</option>
                    <option value="yearly">Yearly VIP</option>
                    <option value="lifetime">Lifetime Access</option>
                    <option value="free">Revoke to Free</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    disabled={selectedPlan === 'lifetime' || selectedPlan === 'free'}
                    value={durationDays}
                    onChange={e => setDurationDays(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 4 }}>Reason / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Customer Promo, Refund compensation"
                  value={grantReason}
                  onChange={e => setGrantReason(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: T.bgEl, border: `1px solid ${T.border}`, borderRadius: 8, color: '#fff', fontSize: 12, outline: 'none' }}
                />
              </div>

              <div style={{ background: 'rgba(245,158,11,0.08)', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 11, color: '#f59e0b', lineHeight: 1.4 }}>
                  This action creates an authoritative server entitlement and logs an immutable audit event in <code>global_audit_logs</code>.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '14px 20px', borderTop: `1px solid ${T.border}` }}>
              <button onClick={() => setGrantModal(false)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSec, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              <button onClick={handleManualGrant} disabled={granting} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>
                {granting ? 'Granting...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
