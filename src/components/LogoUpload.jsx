import { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';
import { FeatureAccessManager } from '../services/FeatureAccessManager';

export default function LogoUpload({ logo, onLogoChange, onLogoRemove }) {
  const [dragActive, setDragActive] = useState(false);
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
      const img = new Image();
      img.onload = () => {
        // Downscale logo to max 256px to optimize memory and rendering speed
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const resizedSrc = canvas.toDataURL('image/png');
        const resizedImg = new Image();
        resizedImg.onload = () => {
          onLogoChange({
            image: resizedImg,
            name: file.name,
            size: file.size,
            src: resizedSrc,
          });
        };
        resizedImg.src = resizedSrc;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [onLogoChange]);

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
    }
  };

  if (logo) {
    return (
      <div className="logo-compact-card-fixed active">
        <div className="logo-compact-preview-fixed">
          <div className="logo-thumb-fixed">
            <img src={logo.src} alt="Logo" />
          </div>
          <div className="logo-details-fixed">
            <span className="name">{logo.name}</span>
            <span className="status"><CheckCircle2 size={10} /> Active</span>
          </div>
          <button className="logo-delete-btn-fixed" onClick={onLogoRemove}>
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
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
          <span className="bottom">PNG, SVG or WEBP</span>
        </div>
      </div>
    </div>
  );
}
