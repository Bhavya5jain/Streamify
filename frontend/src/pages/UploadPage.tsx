import React, { useState, useRef } from 'react';
import {
  Upload, Image, X, Plus, ChevronDown,
  Globe, Lock, Users, Eye, Check, AlertCircle, Film, CheckCircle2
} from 'lucide-react';
import './UploadPage.css';


const categories = ['Tech', 'Music', 'Gaming', 'Travel', 'Food', 'Design', 'Sports', 'Science', 'Comedy', 'Education'];
const visibilityOptions = [
  { value: 'public', label: 'Public', icon: <Globe size={16} />, desc: 'Everyone can see this video' },
  { value: 'unlisted', label: 'Unlisted', icon: <Users size={16} />, desc: 'Only people with the link' },
  { value: 'private', label: 'Private', icon: <Lock size={16} />, desc: 'Only you can see this' },
];

const UploadPage: React.FC = () => {
  const [dragging, setDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Tech',
  });

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('video/')) {
      setVideoFile(file);
      setUploadProgress(0);
      setUploaded(false);
      setUploading(false);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Reset progress state so the bar is fresh for the real upload
      setUploadProgress(0);
      setUploaded(false);
      setUploading(false);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };


  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '');
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!videoFile) {
      setSubmitError('Please select a video file first.');
      return;
    }
    if (!form.title.trim()) {
      setSubmitError('Please enter a title.');
      return;
    }

    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('title', form.title.trim());
    formData.append('discription', form.description.trim());
    formData.append('category', form.category);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    setUploading(true);
    setUploaded(false);
    setUploadProgress(0);

    // Use XHR for real upload progress tracking
    const xhr = new XMLHttpRequest();

    // Track upload progress (browser → server)
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        // Cap at 90% — the remaining 10% is Cloudinary processing on server
        setUploadProgress(Math.min(pct, 90));
      }
    });

    xhr.addEventListener('load', () => {
      let data: any = {};
      try { data = JSON.parse(xhr.responseText); } catch (_) {}

      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(100);
        setUploading(false);
        setUploaded(true);
        setSubmitSuccess(true);
      } else {
        setUploading(false);
        setSubmitError(data?.message || `Upload failed (${xhr.status}). Please try again.`);
      }
    });

    xhr.addEventListener('error', () => {
      setUploading(false);
      setSubmitError('Network error — make sure the backend server is running on port 8000.');
    });

    xhr.addEventListener('timeout', () => {
      setUploading(false);
      setSubmitError('Upload timed out. Your video may be too large or the connection is slow. Try a smaller file.');
    });

    // 10 minute timeout (large videos can take a while on Cloudinary free tier)
    xhr.timeout = 10 * 60 * 1000;

    const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';
    xhr.open('POST', `${BASE_URL}/videos`);
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  return (
    <div className="upload-page page-container">
      <div className="upload-header">
        <h1 className="upload-heading gradient-text">Upload Video</h1>
        <p className="upload-subheading">Share your content with millions of viewers</p>
      </div>

      <form className="upload-form" onSubmit={handleSubmit} id="upload-form">
        <div className="upload-layout">
          {/* Left: Main form */}
          <div className="upload-main">
            {/* Drop zone */}
            {!videoFile ? (
              <div
                className={`drop-zone ${dragging ? 'dragging' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => videoInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload video file"
                id="video-drop-zone"
              >
                <div className="drop-zone-icon">
                  <Film size={40} />
                </div>
                <p className="drop-zone-title">Drag & drop your video here</p>
                <p className="drop-zone-sub">MP4, MOV, AVI, WebM · Max 10GB</p>
                <button type="button" className="btn btn-primary" onClick={e => { e.stopPropagation(); videoInputRef.current?.click(); }}>
                  <Upload size={16} /> Choose File
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleVideoSelect}
                  id="video-file-input"
                />
              </div>
            ) : (
              <div className="upload-progress-card">
                <div className="upload-file-info">
                  <div className="upload-file-icon">
                    <Film size={24} />
                  </div>
                  <div>
                    <p className="upload-filename">{videoFile.name}</p>
                    <p className="upload-filesize">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  {uploaded ? (
                    <div className="upload-success-icon">
                      <Check size={18} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => { setVideoFile(null); setUploading(false); setUploaded(false); setUploadProgress(0); }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                  />
                </div>
                <div className="upload-progress-label">
                  {uploaded ? (
                    <span className="upload-done">✓ Upload complete</span>
                  ) : uploadProgress >= 90 ? (
                    <span>Processing on Cloudinary... please wait</span>
                  ) : (
                    <span>{Math.round(Math.min(uploadProgress, 100))}% uploaded...</span>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label htmlFor="video-title" className="label">Title *</label>
              <input
                id="video-title"
                type="text"
                className="input"
                placeholder="Give your video a catchy title..."
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                maxLength={100}
                required
              />
              <span className="char-count">{form.title.length}/100</span>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="video-desc" className="label">Description</label>
              <textarea
                id="video-desc"
                className="input"
                placeholder="Tell viewers about your video..."
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={5}
                maxLength={5000}
              />
              <span className="char-count">{form.description.length}/5000</span>
            </div>

            {/* Category + Tags */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="video-category" className="label">Category</label>
                <select
                  id="video-category"
                  className="input"
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label">Tags</label>
                <div className="tags-input-wrap">
                  <div className="tags-list">
                    {tags.map(tag => (
                      <span key={tag} className="tag tag-removable">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="tag-input-inline"
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      id="tags-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Thumbnail + Visibility */}
          <div className="upload-sidebar">
            {/* Thumbnail */}
            <div className="upload-card">
              <h3 className="upload-card-title">Thumbnail</h3>
              <div
                className="thumb-upload-zone"
                onClick={() => thumbInputRef.current?.click()}
                role="button"
                tabIndex={0}
                id="thumbnail-upload-zone"
              >
                {thumbnailPreview ? (
                  <div className="thumb-preview-wrap">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="thumb-preview" />
                    <div className="thumb-preview-overlay">
                      <Image size={20} />
                      <span>Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="thumb-placeholder">
                    <Image size={32} />
                    <span>Upload thumbnail</span>
                    <span className="thumb-hint">JPG, PNG · 1280×720</span>
                  </div>
                )}
              </div>
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleThumbnailSelect}
                id="thumbnail-input"
              />
            </div>

            {/* Visibility */}
            <div className="upload-card">
              <h3 className="upload-card-title">Visibility</h3>
              <div className="visibility-options">
                {visibilityOptions.map(opt => (
                  <label
                    key={opt.value}
                    className={`visibility-option ${visibility === opt.value ? 'selected' : ''}`}
                    id={`visibility-${opt.value}`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={opt.value}
                      checked={visibility === opt.value}
                      onChange={() => setVisibility(opt.value)}
                      style={{ display: 'none' }}
                    />
                    <span className="visibility-icon">{opt.icon}</span>
                    <div className="visibility-text">
                      <span className="visibility-label">{opt.label}</span>
                      <span className="visibility-desc">{opt.desc}</span>
                    </div>
                    {visibility === opt.value && <Check size={16} className="visibility-check" />}
                  </label>
                ))}
              </div>
            </div>

            {/* Error message */}
            {submitError && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#f87171',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '4px',
              }}>
                <AlertCircle size={16} />
                {submitError}
              </div>
            )}

            {/* Success message */}
            {submitSuccess && (
              <div style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#4ade80',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '4px',
              }}>
                <CheckCircle2 size={16} />
                Video published successfully! It may take a moment to appear.
              </div>
            )}

            {/* Info card */}
            <div className="upload-info-card">
              <AlertCircle size={16} />
              <p>Your video will be uploaded to Cloudinary and saved. Make sure you are logged in.</p>
            </div>

            {/* Action Buttons */}
            <div className="upload-actions">
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} id="save-draft-btn">
                Save Draft
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
                disabled={uploading || !videoFile || submitSuccess}
                id="publish-btn"
              >
                {uploading ? (
                  <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Uploading...</>
                ) : submitSuccess ? (
                  <><CheckCircle2 size={16} /> Published!</>
                ) : (
                  <><Eye size={16} /> Publish Video</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;

