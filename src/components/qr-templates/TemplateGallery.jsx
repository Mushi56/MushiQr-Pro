// src/components/qr-templates/TemplateGallery.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Heart, Clock, X, Sparkles, Filter } from 'lucide-react';
import { TEMPLATE_CATEGORIES, searchTemplates } from '../../data/qrTemplates';
import { TemplateCard } from './TemplateCard';
import { FeatureAccessManager } from '../../services/FeatureAccessManager';

export function TemplateGallery({
  templates,
  selectedTemplate,
  onSelectTemplate,
  qrMatrixInfo,
  currentQrOptions,
  headlineText,
  handleText
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('mushiqr_fav_templates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recentTemplates, setRecentTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('mushiqr_recent_templates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try {
        localStorage.setItem('mushiqr_fav_templates', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSelect = (tpl) => {
    if (tpl) {
      setRecentTemplates(prev => {
        const next = [tpl.id, ...prev.filter(id => id !== tpl.id)].slice(0, 10);
        try {
          localStorage.setItem('mushiqr_recent_templates', JSON.stringify(next));
        } catch {}
        return next;
      });
      // Ensure we pass the enriched template with drawBackground function
      const fullTemplate = templates.find(t => t.id === tpl.id) || tpl;
      onSelectTemplate(fullTemplate);
    } else {
      onSelectTemplate(null);
    }
  };

  const filteredTemplates = useMemo(() => {
    let list = templates;
    if (selectedCategory === 'Favorites') {
      list = list.filter(t => favorites.includes(t.id));
    } else if (selectedCategory === 'Recent') {
      list = list.filter(t => recentTemplates.includes(t.id));
    } else {
      list = searchTemplates(searchQuery, selectedCategory);
    }

    if (searchQuery && (selectedCategory === 'Favorites' || selectedCategory === 'Recent')) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => 
        (t.name || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.headline || '').toLowerCase().includes(q)
      );
    }

    return list.filter(t => FeatureAccessManager.isFeatureEnabled(`qr_template_${t.id}`));
  }, [templates, searchQuery, selectedCategory, favorites, recentTemplates]);

  const categories = ['All', 'Favorites', 'Recent', ...TEMPLATE_CATEGORIES.filter(c => c !== 'All')];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Search Bar */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-elevated)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        padding: '0 12px'
      }}>
        <Search size={16} color="var(--text-tertiary)" style={{ marginRight: '8px' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates (e.g. WhatsApp, review, menu, bio)..."
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none'
      }}>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                flex: '0 0 auto',
                padding: '6px 14px',
                borderRadius: '12px',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {cat === 'Favorites' && <Heart size={12} fill={isSelected ? '#fff' : 'none'} />}
              {cat === 'Recent' && <Clock size={12} />}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Templates Count Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2px',
        fontSize: '12px',
        color: 'var(--text-tertiary)',
        fontWeight: 600
      }}>
        <span>Showing {filteredTemplates.length} templates</span>
        {selectedTemplate && (
          <button
            onClick={() => handleSelect(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 700
            }}
          >
            Remove Template Frame
          </button>
        )}
      </div>

      {/* Template Card Grid (3 Columns) */}
      {filteredTemplates.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '12px'
        }}>
          {filteredTemplates.map(tpl => {
            const isSelected = selectedTemplate?.id === tpl.id;
            const isFav = favorites.includes(tpl.id);
            return (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                isSelected={isSelected}
                onSelect={() => handleSelect(isSelected ? null : tpl)}
                isFavorite={isFav}
                onToggleFavorite={toggleFavorite}
                headlineText={headlineText}
                handleText={handleText}
                qrMatrixInfo={qrMatrixInfo}
                currentQrOptions={currentQrOptions}
              />
            );
          })}
        </div>
      ) : (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '13px'
        }}>
          No templates found matching "{searchQuery}" in {selectedCategory}.
        </div>
      )}
    </div>
  );
}
