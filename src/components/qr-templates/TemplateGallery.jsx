// src/components/qr-templates/TemplateGallery.jsx
import React, { useState, useMemo } from 'react';
import { 
  Grid, 
  Heart, 
  Clock, 
  Share2, 
  Briefcase, 
  MessageSquare, 
  Megaphone, 
  Wrench, 
  Contact 
} from 'lucide-react';
import { TEMPLATE_CATEGORIES } from '../../data/qrTemplates';
import { TemplateCard } from './TemplateCard';
import { FeatureAccessManager } from '../../services/FeatureAccessManager';

// Category icon map for toolbar styling
const CATEGORY_ICONS = {
  'All': Grid,
  'Favorites': Heart,
  'Recent': Clock,
  'Social Media': Share2,
  'Business': Briefcase,
  'Communication': MessageSquare,
  'Marketing': Megaphone,
  'Utility': Wrench,
  'vCard': Contact
};

export function TemplateGallery({
  templates,
  selectedTemplate,
  onSelectTemplate,
  qrMatrixInfo,
  currentQrOptions,
  headlineText,
  handleText
}) {
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
    } else if (selectedCategory === 'All') {
      list = templates;
    } else {
      list = templates.filter(t => t.category === selectedCategory);
    }

    return list.filter(t => FeatureAccessManager.isFeatureEnabled(`qr_template_${t.id}`));
  }, [templates, selectedCategory, favorites, recentTemplates]);

  const categories = ['All', 'Favorites', 'Recent', ...TEMPLATE_CATEGORIES.filter(c => c !== 'All')];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Category Toolbar Style Container (Icon + Label Toolbar items) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-elevated)',
        padding: '8px 10px',
        borderRadius: '18px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        gap: '6px'
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '2px 0',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          flex: 1
        }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const IconComp = CATEGORY_ICONS[cat] || Grid;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  flex: '0 0 auto',
                  padding: '8px 14px',
                  borderRadius: '14px',
                  border: isSelected ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent',
                  background: isSelected ? 'rgba(214, 0, 54, 0.12)' : 'transparent',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  minWidth: '58px'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '10px',
                  background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(214, 0, 54, 0.3)' : 'none'
                }}>
                  <IconComp 
                    size={15} 
                    color={isSelected ? '#FFFFFF' : 'var(--text-primary)'} 
                    fill={cat === 'Favorites' && isSelected ? '#FFFFFF' : 'none'}
                    strokeWidth={isSelected ? 2.5 : 2}
                  />
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: isSelected ? 800 : 600,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.2px'
                }}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Count Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 4px',
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

      {/* Template Card Grid — 3 columns */}
      {filteredTemplates.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
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
          No templates found in {selectedCategory}.
        </div>
      )}
    </div>
  );
}
