import { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, CheckCircle2, Crop } from 'lucide-react';
import { FeatureAccessManager } from '../services/FeatureAccessManager';
import ImageCropShapeModal from './ImageCropShapeModal';

export default function LogoUpload({ logo, onLogoChange, onLogoRemove }) {
  const [dragActive, setDragActive] = useState(false);
  const [cropModalData, setCropModalData] = useState(null); // { src, name, file }
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const access = FeatureAccessManager.canUseFeature('custom_logo');
    if (!access.allowed) {
      alert('Custom Logo Embed feature is disabled or requires a plan upgrade.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCropModalData({
        src: e.target.result,
        name: file.name,
        file
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      handleFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleCropConfirm = ({ image, src, name, shape }) => {
    onLogoChange({
      image,
      name,
      src,
      shape
    });
    setCropModalData(null);
  };

  return (
    <>
      {logo ? (
        <div className="logo-compact-card-fixed active">
          <div className="logo-compact-preview-fixed">
            <div className="logo-thumb-fixed">
              <img src={logo.src} alt="Logo" />
            </div>
            <div className="logo-details-fixed">
              <span className="name">{logo.name}</span>
              <span className="status"><CheckCircle2 size={10} /> Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button 
                type="button"
                className="logo-delete-btn-fixed" 
                onClick={() => setCropModalData({ src: logo.src, name: logo.name || 'logo.png' })}
                title="Crop & Shape Logo"
                style={{ color: 'var(--accent-primary)' }}
              >
                <Crop size={14} />
              </button>
              <button 
                type="button"
                className="logo-delete-btn-fixed" 
                onClick={onLogoRemove}
                title="Remove Logo"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`logo-compact-upload-fixed ${dragActive ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleChange}
            hidden
          />
          <div className="logo-compact-btn-content">
            <div className="btn-icon">
              <UploadCloud size={22} />
            </div>
            <div className="btn-text">
              <span className="top">Upload Custom Logo</span>
              <span className="bottom">1:1 Crop &amp; Custom Shapes</span>
            </div>
          </div>
        </div>
      )}

      {cropModalData && (
        <ImageCropShapeModal
          isOpen={Boolean(cropModalData)}
          imageSrc={cropModalData.src}
          imageName={cropModalData.name}
          title="Crop & Shape Logo"
          initialShape={logo?.shape || 'rounded'}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropModalData(null)}
        />
      )}
    </>
  );
}
