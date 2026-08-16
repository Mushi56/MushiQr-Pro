// src/components/admin/FeatureFlagsPanel.jsx
// â”€â”€â”€ Mobile-First Feature Flags Management System â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Matches the provided reference mockup across 320px mobile up to 4K desktop.

import React, { useState, useEffect, useMemo } from 'react';
import {
  Flag, Plus, Search, Filter, ChevronRight, ArrowLeft, MoreVertical,
  CheckCircle2, XCircle, AlertCircle, Clock, Copy, Check, Trash2, Edit3,
  Sliders, Globe, Users, Shield, Crown, BarChart2, Layers, Palette,
  Sparkles, Cpu, Download, Cloud, ScanLine, MapPin, FlaskConical,
  TrendingUp, RefreshCw, X, Radio
} from 'lucide-react';
import {
  subscribeFeatureFlags,
  toggleFeatureFlag,
  createFeatureFlag,
  updateFeatureFlag,
  deleteFeatureFlag,
  FLAG_CATEGORIES,
  ENVIRONMENTS,
  TARGETING_OPTIONS,
  getTargetingLabel
} from '../services/featureFlagsService';
import { useAdminTheme } from './AdminUIKit';

// Map icon names to Lucide icons
const ICON_MAP = {
  Crown: Crown,
  Grid: BarChart2,
  Barcode: ScanLine,
  Layers: Layers,
  Sparkles: Sparkles,
  Palette: Palette,
  Download: Download,
  Cloud: Cloud,
  Cpu: Cpu,
  ScanLine: ScanLine,
  Shield: Shield,
  MapPin: MapPin,
  Flag: Flag,
  FlaskConical: FlaskConical,
  CheckCircle: CheckCircle2
};

export default function FeatureFlagsPanel({ currentUser, isDark: propIsDark }) {
  const theme = useAdminTheme();
  const isDark = propIsDark !== undefined ? propIsDark : (theme?.isDark ?? false);

  // â”€â”€ States â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMode, setActiveMode] = useState('list'); // 'list' | 'details' | 'create' | 'edit' | 'stats'
  const [selectedFlag, setSelectedFlag] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'enabled' | 'disabled'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [envFilter, setEnvFilter] = useState('all');
  const [targetingFilter, setTargetingFilter] = useState('all');

  // Form State (Create / Edit)
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    category: 'Core Feature',
    environment: 'Production',
    enabled: true,
    targeting: 'all',
    rolloutPercentage: 100,
    icon: 'Flag',
    iconColor: '#FF4D9D',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // â”€â”€ Real-time Firestore Subscription â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeFeatureFlags(
      (data) => {
        setFlags(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err?.message || 'Failed to load feature flags.');
        setLoading(false);
      }
    );
    return () => unsubscribe && unsubscribe();
  }, []);

  // Show temporary toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // â”€â”€ Computed Statistics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const stats = useMemo(() => {
    const total = flags.length;
    const enabled = flags.filter(f => f.enabled).length;
    const disabled = total - enabled;
    const targeted = flags.filter(f => f.targeting && f.targeting !== 'all').length;
    const enabledPct = total > 0 ? ((enabled / total) * 100).toFixed(1) : '0.0';
    const disabledPct = total > 0 ? ((disabled / total) * 100).toFixed(1) : '0.0';
    const targetedPct = total > 0 ? ((targeted / total) * 100).toFixed(1) : '0.0';

    return { total, enabled, disabled, targeted, enabledPct, disabledPct, targetedPct };
  }, [flags]);

  // â”€â”€ Filtered Flags â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredFlags = useMemo(() => {
    return flags.filter(flag => {
      // Search
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchName = flag.name?.toLowerCase().includes(query);
        const matchKey = flag.key?.toLowerCase().includes(query);
        const matchDesc = flag.description?.toLowerCase().includes(query);
        if (!matchName && !matchKey && !matchDesc) return false;
      }

      // Status
      if (statusFilter === 'enabled' && !flag.enabled) return false;
      if (statusFilter === 'disabled' && flag.enabled) return false;

      // Category
      if (categoryFilter !== 'all' && flag.category !== categoryFilter) return false;

      // Environment
      if (envFilter !== 'all' && flag.environment !== envFilter) return false;

      // Targeting
      if (targetingFilter !== 'all' && flag.targeting !== targetingFilter) return false;

      return true;
    });
  }, [flags, searchQuery, statusFilter, categoryFilter, envFilter, targetingFilter]);

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || envFilter !== 'all' || targetingFilter !== 'all' || searchQuery.trim() !== '';

  const clearAllFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setEnvFilter('all');
    setTargetingFilter('all');
    setSearchQuery('');
    setFilterOpen(false);
  };

  // â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleToggle = async (e, flag) => {
    e.stopPropagation();
    try {
      const nextState = !flag.enabled;
      // Optimistic update
      setFlags(prev => prev.map(f => f.id === flag.id ? { ...f, enabled: nextState } : f));
      if (selectedFlag && selectedFlag.id === flag.id) {
        setSelectedFlag(prev => ({ ...prev, enabled: nextState }));
      }
      await toggleFeatureFlag(flag.id, nextState, currentUser);
      showToast(`${flag.name} ${nextState ? 'enabled' : 'disabled'}`);
    } catch (err) {
      showToast('Error updating flag: ' + (err.message || 'Check permissions'));
      // Rollback
      setFlags(prev => prev.map(f => f.id === flag.id ? { ...f, enabled: flag.enabled } : f));
    }
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      key: '',
      description: '',
      category: 'Core Feature',
      environment: 'Production',
      enabled: true,
      targeting: 'all',
      rolloutPercentage: 100,
      icon: 'Flag',
      iconColor: '#FF4D9D',
    });
    setFormErrors({});
    setActiveMode('create');
  };

  const openEditModal = (flag) => {
    setSelectedFlag(flag);
    setFormData({
      name: flag.name || '',
      key: flag.key || flag.id,
      description: flag.description || '',
      category: flag.category || 'Core Feature',
      environment: flag.environment || 'Production',
      enabled: Boolean(flag.enabled),
      targeting: flag.targeting || 'all',
      rolloutPercentage: Number(flag.rolloutPercentage ?? 100),
      icon: flag.icon || 'Flag',
      iconColor: flag.iconColor || '#FF4D9D',
    });
    setFormErrors({});
    setActiveMode('edit');
  };

  const openDetails = (flag) => {
    setSelectedFlag(flag);
    setActiveMode('details');
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    showToast(`Copied "${key}" to clipboard!`);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Flag name is required.';
    if (activeMode === 'create') {
      const cleanKey = formData.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      if (!cleanKey) errors.key = 'Valid flag key is required (e.g. premium_features).';
      else if (cleanKey.length < 3) errors.key = 'Key must be at least 3 characters.';
      formData.key = cleanKey;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      if (activeMode === 'create') {
        const res = await createFeatureFlag(formData, currentUser);
        showToast(`Created flag "${formData.name}" successfully!`);
        if (res.flag) setSelectedFlag(res.flag);
      } else if (activeMode === 'edit') {
        await updateFeatureFlag(selectedFlag.id, formData, currentUser);
        showToast(`Updated flag "${formData.name}"!`);
        setSelectedFlag(prev => ({ ...prev, ...formData }));
      }
      setActiveMode('list');
    } catch (err) {
      setFormErrors({ submit: err.message || 'Failed to save feature flag.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFlag) return;
    setSubmitting(true);
    try {
      await deleteFeatureFlag(selectedFlag.id, currentUser);
      showToast(`Deleted flag "${selectedFlag.name}"`);
      setDeleteConfirm(false);
      setSelectedFlag(null);
      setActiveMode('list');
    } catch (err) {
      showToast('Failed to delete: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for relative time
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // â”€â”€ Render Sub-views â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // 1. Details Sub-view
  if (activeMode === 'details' && selectedFlag) {
    const IconComp = ICON_MAP[selectedFlag.icon] || Flag;
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', animation: 'adSlideIn 0.2s ease' }}>
        {/* Toast */}
        {toastMessage && <Toast message={toastMessage} />}

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button
            onClick={() => setActiveMode('list')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: 'var(--ad-text)',
              fontSize: 16, fontWeight: 800, cursor: 'pointer', padding: 0
            }}
          >
            <ArrowLeft size={20} />
            <span>Feature Flag Details</span>
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDeleteConfirm(prev => !prev)}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ad-text-sec)', cursor: 'pointer'
              }}
            >
              <MoreVertical size={18} />
            </button>

            {deleteConfirm && (
              <div style={{
                position: 'absolute', right: 0, top: 44, width: 180,
                background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
                borderRadius: 12, padding: 8, boxShadow: 'var(--ad-card-shadow)', zIndex: 100
              }}>
                <button
                  onClick={handleDelete}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                    padding: '8px 12px', background: 'none', border: 'none',
                    color: '#EF4444', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    borderRadius: 8, textAlign: 'left'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <Trash2 size={15} /> Delete Flag
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details Card */}
        <div style={{
          background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
          borderRadius: 20, padding: '24px 20px', boxShadow: 'var(--ad-card-shadow)',
          display: 'flex', flexDirection: 'column', gap: 20
        }}>
          {/* Main Info Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: selectedFlag.iconBg || 'rgba(255, 77, 157, 0.12)',
                color: selectedFlag.iconColor || '#FF4D9D',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <IconComp size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ad-text)', margin: 0 }}>
                  {selectedFlag.name}
                </h2>
                <div style={{ fontSize: 13, color: 'var(--ad-text-sec)', marginTop: 4, lineHeight: 1.4 }}>
                  {selectedFlag.description || 'No description provided.'}
                </div>
              </div>
            </div>

            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 800,
              background: selectedFlag.enabled ? 'rgba(34, 197, 94, 0.14)' : 'rgba(239, 68, 68, 0.12)',
              color: selectedFlag.enabled ? '#22C55E' : '#EF4444'
            }}>
              {selectedFlag.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div style={{ height: 1, background: 'var(--ad-border)' }} />

          {/* Details Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {/* Key with Copy */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 4 }}>Key</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--ad-input)', padding: '6px 10px', borderRadius: 8,
                border: '1px solid var(--ad-border)', width: 'fit-content'
              }}>
                <code style={{ fontSize: 13, fontWeight: 700, color: 'var(--ad-text)' }}>{selectedFlag.key}</code>
                <button
                  onClick={() => handleCopyKey(selectedFlag.key)}
                  title="Copy Key"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: copiedKey ? '#22C55E' : 'var(--ad-text-sec)' }}
                >
                  {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Status Switch */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 4 }}>Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Toggle
                  checked={selectedFlag.enabled}
                  onChange={(e) => handleToggle(e, selectedFlag)}
                />
                <span style={{ fontSize: 13, fontWeight: 700, color: selectedFlag.enabled ? '#22C55E' : 'var(--ad-text-sec)' }}>
                  {selectedFlag.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Environment */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 4 }}>Environment</div>
              <span style={{
                display: 'inline-flex', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                background: 'rgba(34, 197, 94, 0.12)', color: '#22C55E'
              }}>
                {selectedFlag.environment || 'Production'}
              </span>
            </div>

            {/* Category */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 4 }}>Category</div>
              <span style={{
                display: 'inline-flex', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                background: 'rgba(123, 97, 255, 0.12)', color: '#7B61FF'
              }}>
                {selectedFlag.category || 'Core Feature'}
              </span>
            </div>

            {/* Targeting */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 4 }}>Targeting</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ad-text)' }}>
                {getTargetingLabel(selectedFlag.targeting, selectedFlag.rolloutPercentage)}
              </div>
            </div>

            {/* Created */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 4 }}>Created</div>
              <div style={{ fontSize: 13, color: 'var(--ad-text)', fontWeight: 600 }}>
                {selectedFlag.createdAt ? new Date(selectedFlag.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 10, 2025'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ad-text-sec)' }}>
                by {selectedFlag.createdBy || 'Super Admin'}
              </div>
            </div>

            {/* Last Updated */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text-sec)', marginBottom: 4 }}>Last Updated</div>
              <div style={{ fontSize: 13, color: 'var(--ad-text)', fontWeight: 600 }}>
                {selectedFlag.updatedAt ? new Date(selectedFlag.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 14, 2025'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ad-text-sec)' }}>
                by {selectedFlag.updatedBy || 'Super Admin'}
              </div>
            </div>
          </div>

          {/* Rollout Progress */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text-sec)' }}>Rollout Percentage</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#FF4D9D' }}>{selectedFlag.rolloutPercentage ?? 100}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--ad-input)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${selectedFlag.rolloutPercentage ?? 100}%`, height: '100%',
                background: 'linear-gradient(135deg, #FF4D9D, #7B61FF)', borderRadius: 4
              }} />
            </div>
          </div>

          {/* Edit Flag Button */}
          <button
            onClick={() => openEditModal(selectedFlag)}
            style={{
              width: '100%', padding: '13px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg, #FF4D9D 0%, #7B61FF 100%)',
              border: 'none', color: '#FFFFFF', fontSize: 14, fontWeight: 800,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(255, 77, 157, 0.35)', marginTop: 10
            }}
          >
            <Edit3 size={16} />
            Edit Flag
          </button>
        </div>
      </div>
    );
  }

  // 2. Create / Edit Form Sub-view
  if (activeMode === 'create' || activeMode === 'edit') {
    const isEdit = activeMode === 'edit';
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', animation: 'adSlideIn 0.2s ease' }}>
        {/* Toast */}
        {toastMessage && <Toast message={toastMessage} />}

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button
            onClick={() => setActiveMode(isEdit ? 'details' : 'list')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: 'var(--ad-text)',
              fontSize: 16, fontWeight: 800, cursor: 'pointer', padding: 0
            }}
          >
            <ArrowLeft size={20} />
            <span>{isEdit ? 'Edit Feature Flag' : 'Create Feature Flag'}</span>
          </button>
        </div>

        {/* Form Card */}
        <form onSubmit={handleFormSubmit} style={{
          background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
          borderRadius: 20, padding: '24px 20px', boxShadow: 'var(--ad-card-shadow)',
          display: 'flex', flexDirection: 'column', gap: 18
        }}>
          {formErrors.submit && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', fontSize: 13, fontWeight: 700 }}>
              {formErrors.submit}
            </div>
          )}

          {/* Flag Name */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Flag Name <span style={{ color: '#FF4D9D' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Premium Features"
              value={formData.name}
              onChange={e => {
                const val = e.target.value;
                setFormData(p => ({
                  ...p,
                  name: val,
                  // auto-generate key only on create if key is empty or touched
                  key: isEdit ? p.key : (p.key === '' || p.key === p.name.toLowerCase().replace(/[^a-z0-9_]/g, '_') ? val.toLowerCase().replace(/[^a-z0-9_]/g, '_') : p.key)
                }));
              }}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--ad-input)',
                border: `1px solid ${formErrors.name ? '#EF4444' : 'var(--ad-border)'}`,
                borderRadius: 10, padding: '11px 14px', color: 'var(--ad-text)',
                fontSize: 14, fontWeight: 600, outline: 'none'
              }}
            />
            {formErrors.name && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{formErrors.name}</div>}
          </div>

          {/* Flag Key */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Flag Key <span style={{ color: '#FF4D9D' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. premium_features"
              value={formData.key}
              disabled={isEdit}
              onChange={e => setFormData(p => ({ ...p, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') }))}
              style={{
                width: '100%', boxSizing: 'border-box', background: isEdit ? 'rgba(0,0,0,0.05)' : 'var(--ad-input)',
                border: `1px solid ${formErrors.key ? '#EF4444' : 'var(--ad-border)'}`,
                borderRadius: 10, padding: '11px 14px', color: 'var(--ad-text)',
                fontSize: 14, fontWeight: 700, outline: 'none', opacity: isEdit ? 0.7 : 1
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--ad-text-sec)', marginTop: 4 }}>
              {isEdit ? 'Key is protected and cannot be modified.' : 'Use lowercase letters, numbers and underscores.'}
            </div>
            {formErrors.key && <div style={{ color: '#EF4444', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{formErrors.key}</div>}
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Describe what this feature flag controls..."
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--ad-input)',
                border: '1px solid var(--ad-border)', borderRadius: 10,
                padding: '11px 14px', color: 'var(--ad-text)', fontSize: 13,
                outline: 'none', resize: 'vertical'
              }}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--ad-input)',
                border: '1px solid var(--ad-border)', borderRadius: 10,
                padding: '11px 14px', color: 'var(--ad-text)', fontSize: 13,
                fontWeight: 700, outline: 'none', cursor: 'pointer'
              }}
            >
              {FLAG_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Environment Dropdown */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Environment
            </label>
            <select
              value={formData.environment}
              onChange={e => setFormData(p => ({ ...p, environment: e.target.value }))}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--ad-input)',
                border: '1px solid var(--ad-border)', borderRadius: 10,
                padding: '11px 14px', color: 'var(--ad-text)', fontSize: 13,
                fontWeight: 700, outline: 'none', cursor: 'pointer'
              }}
            >
              {ENVIRONMENTS.map(env => (
                <option key={env.id} value={env.id}>{env.label}</option>
              ))}
            </select>
          </div>

          {/* Status Radio Buttons (Enabled vs Disabled matching mockup) */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 8 }}>
              Status
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, enabled: true }))}
                style={{
                  padding: '12px 14px', borderRadius: 12,
                  border: `1.5px solid ${formData.enabled ? '#22C55E' : 'var(--ad-border)'}`,
                  background: formData.enabled ? 'rgba(34, 197, 94, 0.12)' : 'var(--ad-input)',
                  color: formData.enabled ? '#22C55E' : 'var(--ad-text-sec)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 13, fontWeight: 800, cursor: 'pointer'
                }}
              >
                <CheckCircle2 size={16} /> Enabled
              </button>

              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, enabled: false }))}
                style={{
                  padding: '12px 14px', borderRadius: 12,
                  border: `1.5px solid ${!formData.enabled ? '#EF4444' : 'var(--ad-border)'}`,
                  background: !formData.enabled ? 'rgba(239, 68, 68, 0.12)' : 'var(--ad-input)',
                  color: !formData.enabled ? '#EF4444' : 'var(--ad-text-sec)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 13, fontWeight: 800, cursor: 'pointer'
                }}
              >
                <XCircle size={16} /> Disabled
              </button>
            </div>
          </div>

          {/* Targeting Dropdown */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)', display: 'block', marginBottom: 6 }}>
              Targeting
            </label>
            <select
              value={formData.targeting}
              onChange={e => setFormData(p => ({ ...p, targeting: e.target.value }))}
              style={{
                width: '100%', boxSizing: 'border-box', background: 'var(--ad-input)',
                border: '1px solid var(--ad-border)', borderRadius: 10,
                padding: '11px 14px', color: 'var(--ad-text)', fontSize: 13,
                fontWeight: 700, outline: 'none', cursor: 'pointer'
              }}
            >
              {TARGETING_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Rollout Percentage (when relevant) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text)' }}>Rollout Percentage</label>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#FF4D9D' }}>{formData.rolloutPercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.rolloutPercentage}
              onChange={e => setFormData(p => ({ ...p, rolloutPercentage: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: '#FF4D9D', cursor: 'pointer' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg, #FF4D9D 0%, #7B61FF 100%)',
              border: 'none', color: '#FFFFFF', fontSize: 14, fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(255, 77, 157, 0.35)', marginTop: 8,
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Flag')}
          </button>
        </form>
      </div>
    );
  }

  // 3. Main Overview View (Matching Primary Mobile Reference)
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'adSlideIn 0.2s ease' }}>
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} />}

      {/* â”€â”€ Title & Create Button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 12
      }}>
        <div>
          <h1 style={{
            fontSize: 20,
            fontWeight: 900,
            color: 'var(--ad-text)',
            margin: 0,
            letterSpacing: '-0.3px'
          }}>
            Feature Flags
          </h1>
          <p style={{
            fontSize: 12,
            color: 'var(--ad-text-sec)',
            margin: '3px 0 0',
            fontWeight: 500
          }}>
            Manage and control application features in real-time
          </p>
        </div>

        {/* Pink + Create Flag Button (Compact '+' on mobile, text on desktop) */}
        <button
          onClick={openCreateModal}
          style={{
            background: 'linear-gradient(135deg, #FF4D9D 0%, #7B61FF 100%)',
            border: 'none',
            borderRadius: 12,
            color: '#FFFFFF',
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 14px rgba(255, 77, 157, 0.35)',
            flexShrink: 0
          }}
        >
          <Plus size={18} strokeWidth={2.6} />
          <span className="ad-hide-mobile">Create Flag</span>
        </button>
      </div>

      {/* â”€â”€ 4 Statistics Cards (2x2 Grid on Mobile, 4-col on Desktop) â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        {/* Total Flags */}
        <StatMiniCard
          icon={Flag}
          iconColor="#7B61FF"
          iconBg="rgba(123, 97, 255, 0.12)"
          title="Total Flags"
          value={stats.total}
          subtitle="All feature flags"
          subColor="var(--ad-text-sec)"
        />

        {/* Enabled */}
        <StatMiniCard
          icon={CheckCircle2}
          iconColor="#22C55E"
          iconBg="rgba(34, 197, 94, 0.12)"
          title="Enabled"
          value={stats.enabled}
          subtitle={`${stats.enabledPct}% of total`}
          subColor="#22C55E"
        />

        {/* Disabled */}
        <StatMiniCard
          icon={AlertCircle}
          iconColor="#F59E0B"
          iconBg="rgba(245, 158, 11, 0.12)"
          title="Disabled"
          value={stats.disabled}
          subtitle={`${stats.disabledPct}% of total`}
          subColor="#F59E0B"
        />

        {/* Targeted */}
        <StatMiniCard
          icon={Users}
          iconColor="#3B82F6"
          iconBg="rgba(59, 130, 246, 0.12)"
          title="Targeted"
          value={stats.targeted}
          subtitle="Flags with targeting"
          subColor="#3B82F6"
        />
      </div>

      {/* â”€â”€ Search & Filter Toolbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16
      }}>
        {/* Search Bar */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--ad-card)',
          border: '1px solid var(--ad-border)',
          borderRadius: 12,
          padding: '10px 14px',
          boxShadow: 'var(--ad-card-shadow)'
        }}>
          <Search size={16} color="var(--ad-text-sec)" />
          <input
            type="text"
            placeholder="Search flags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--ad-text)',
              fontSize: 13,
              fontFamily: 'inherit',
              fontWeight: 600
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--ad-text-sec)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setFilterOpen(true)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: hasActiveFilters ? 'rgba(255, 77, 157, 0.15)' : 'var(--ad-card)',
            border: `1px solid ${hasActiveFilters ? '#FF4D9D' : 'var(--ad-border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hasActiveFilters ? '#FF4D9D' : 'var(--ad-text)',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: 'var(--ad-card-shadow)'
          }}
          title="Filter flags"
        >
          <Filter size={18} />
        </button>
      </div>

      {/* Active filter badges indicator */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: 'var(--ad-text-sec)', fontWeight: 600 }}>Active filters:</span>
          {statusFilter !== 'all' && (
            <FilterPill label={`Status: ${statusFilter}`} onRemove={() => setStatusFilter('all')} />
          )}
          {categoryFilter !== 'all' && (
            <FilterPill label={`Category: ${categoryFilter}`} onRemove={() => setCategoryFilter('all')} />
          )}
          {envFilter !== 'all' && (
            <FilterPill label={`Env: ${envFilter}`} onRemove={() => setEnvFilter('all')} />
          )}
          {targetingFilter !== 'all' && (
            <FilterPill label={`Target: ${targetingFilter}`} onRemove={() => setTargetingFilter('all')} />
          )}
          <button
            onClick={clearAllFilters}
            style={{ background: 'none', border: 'none', color: '#FF4D9D', fontSize: 11, fontWeight: 700, cursor: 'pointer', padding: '2px 6px' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* â”€â”€ Feature Flag Cards List â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              height: 100, borderRadius: 16, background: 'var(--ad-card)',
              border: '1px solid var(--ad-border)', opacity: 0.5, animation: 'adSpin 1.5s infinite alternate'
            }} />
          ))}
        </div>
      ) : error ? (
        <div style={{
          background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
          borderRadius: 16, padding: '32px 20px', textAlign: 'center'
        }}>
          <AlertCircle size={32} color="#EF4444" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ad-text)' }}>{error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 12, padding: '8px 16px', borderRadius: 8,
              background: '#FF4D9D', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      ) : filteredFlags.length === 0 ? (
        <div style={{
          background: 'var(--ad-card)', border: '1px solid var(--ad-border)',
          borderRadius: 16, padding: '48px 20px', textAlign: 'center'
        }}>
          <Flag size={36} color="#FF4D9D" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ad-text)', marginBottom: 4 }}>
            No feature flags found
          </div>
          <div style={{ fontSize: 13, color: 'var(--ad-text-sec)', maxWidth: 320, margin: '0 auto 16px' }}>
            {hasActiveFilters ? 'No feature flags match your search filters.' : 'Create your first feature flag to control application capabilities.'}
          </div>
          {hasActiveFilters ? (
            <button
              onClick={clearAllFilters}
              style={{
                padding: '9px 18px', borderRadius: 10, background: 'var(--ad-input)',
                border: '1px solid var(--ad-border)', color: 'var(--ad-text)', fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={openCreateModal}
              style={{
                padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #FF4D9D, #7B61FF)',
                border: 'none', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer'
              }}
            >
              + Create Flag
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredFlags.map(flag => {
            const IconComp = ICON_MAP[flag.icon] || Flag;
            return (
              <div
                key={flag.id}
                onClick={() => openDetails(flag)}
                style={{
                  background: 'var(--ad-card)',
                  border: '1px solid var(--ad-border)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  boxShadow: 'var(--ad-card-shadow)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'transform 0.12s ease, border-color 0.12s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255, 77, 157, 0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--ad-border)'}
              >
                {/* Top Row: Icon + Title/Desc + Toggle Switch */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    {/* Icon Box */}
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: flag.iconBg || 'rgba(255, 77, 157, 0.12)',
                      color: flag.iconColor || '#FF4D9D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComp size={19} />
                    </div>

                    {/* Title and Short Description */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: 'var(--ad-text)',
                        letterSpacing: '-0.2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {flag.name}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: 'var(--ad-text-sec)',
                        marginTop: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {flag.description || `Key: ${flag.key}`}
                      </div>
                    </div>
                  </div>

                  {/* Toggle & Chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    <Toggle
                      checked={flag.enabled}
                      onChange={(e) => handleToggle(e, flag)}
                    />
                    <ChevronRight size={18} color="var(--ad-text-sec)" style={{ opacity: 0.6 }} />
                  </div>
                </div>

                {/* Bottom Row: Environment, Category, Targeting, Relative Time */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                  fontSize: 11,
                  fontWeight: 700
                }}>
                  {/* Environment Badge */}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 100,
                    background: flag.environment === 'Production' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                    color: flag.environment === 'Production' ? '#22C55E' : '#3B82F6'
                  }}>
                    {flag.environment || 'Production'}
                  </span>

                  {/* Category Badge */}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 100,
                    background: 'rgba(123, 97, 255, 0.12)',
                    color: '#7B61FF'
                  }}>
                    {flag.category || 'Core Feature'}
                  </span>

                  {/* Targeting Badge */}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 100,
                    background: 'var(--ad-input)',
                    color: 'var(--ad-text-sec)'
                  }}>
                    {getTargetingLabel(flag.targeting, flag.rolloutPercentage)}
                  </span>

                  {/* Timestamp */}
                  <span style={{ marginLeft: 'auto', color: 'var(--ad-text-mut)', fontWeight: 500, fontSize: 11 }}>
                    {formatTimeAgo(flag.updatedAt || flag.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* â”€â”€ Filter Bottom Sheet / Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {filterOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }} onClick={() => setFilterOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 480, maxHeight: '80vh', overflowY: 'auto',
              background: 'var(--ad-card)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
              padding: '24px 20px', border: '1px solid var(--ad-border)',
              display: 'flex', flexDirection: 'column', gap: 16,
              boxShadow: '0 -10px 40px rgba(0,0,0,0.4)', animation: 'adSlideIn 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ad-text)' }}>Filter Flags</div>
              <button
                onClick={() => setFilterOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--ad-text-sec)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Filter */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text-sec)', display: 'block', marginBottom: 6 }}>Status</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['all', 'enabled', 'disabled'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    style={{
                      flex: 1, padding: '8px 10px', borderRadius: 8,
                      border: `1px solid ${statusFilter === s ? '#FF4D9D' : 'var(--ad-border)'}`,
                      background: statusFilter === s ? 'rgba(255, 77, 157, 0.12)' : 'var(--ad-input)',
                      color: statusFilter === s ? '#FF4D9D' : 'var(--ad-text)',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Environment Filter */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text-sec)', display: 'block', marginBottom: 6 }}>Environment</label>
              <select
                value={envFilter}
                onChange={e => setEnvFilter(e.target.value)}
                style={{
                  width: '100%', background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
                  borderRadius: 10, padding: '10px 12px', color: 'var(--ad-text)', fontSize: 13, fontWeight: 600, outline: 'none'
                }}
              >
                <option value="all">All Environments</option>
                {ENVIRONMENTS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--ad-text-sec)', display: 'block', marginBottom: 6 }}>Category</label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{
                  width: '100%', background: 'var(--ad-input)', border: '1px solid var(--ad-border)',
                  borderRadius: 10, padding: '10px 12px', color: 'var(--ad-text)', fontSize: 13, fontWeight: 600, outline: 'none'
                }}
              >
                <option value="all">All Categories</option>
                {FLAG_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button
                onClick={clearAllFilters}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, background: 'var(--ad-input)',
                  border: '1px solid var(--ad-border)', color: 'var(--ad-text)', fontSize: 13, fontWeight: 700, cursor: 'pointer'
                }}
              >
                Clear Filters
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg, #FF4D9D, #7B61FF)',
                  border: 'none', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer'
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€ Micro Sub-Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatMiniCard({ icon: Icon, iconColor, iconBg, title, value, subtitle, subColor }) {
  return (
    <div style={{
      background: 'var(--ad-card)',
      border: '1px solid var(--ad-border)',
      borderRadius: 16,
      padding: '14px 14px',
      boxShadow: 'var(--ad-card-shadow)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 8
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: iconBg, color: iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={16} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ad-text-sec)' }}>{title}</span>
      </div>

      <div>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--ad-text)', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: subColor, marginTop: 4 }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onChange}
      style={{
        width: 42,
        height: 24,
        borderRadius: 12,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? '#22C55E' : 'rgba(120, 120, 140, 0.25)',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        padding: 0,
        outline: 'none'
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        position: 'absolute',
        top: 3,
        left: checked ? 21 : 3,
        transition: 'left 0.2s ease'
      }} />
    </button>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 100,
      background: 'rgba(255, 77, 157, 0.12)', color: '#FF4D9D', fontSize: 11, fontWeight: 700
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', color: '#FF4D9D', cursor: 'pointer', padding: 0 }}>
        <X size={11} />
      </button>
    </span>
  );
}

function Toast({ message }) {
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: '#0F1221', color: '#FFFFFF', border: '1px solid rgba(255, 77, 157, 0.4)',
      borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 700,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 8,
      animation: 'adSlideIn 0.2s ease'
    }}>
      <Sparkles size={16} color="#FF4D9D" />
      <span>{message}</span>
    </div>
  );
}
