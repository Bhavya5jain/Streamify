import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

interface RegisterForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<RegisterForm>({
    fullName: '', username: '', email: '', password: '', confirmPassword: ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.username || !form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!avatarRef.current?.files?.[0]) {
      setError('Avatar is required');
      return;
    }
    setLoading(true);
    // TODO: call POST /api/users/register (multipart/form-data) during integration
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob--1" />
      <div className="auth-blob auth-blob--2" />
      <div className="auth-blob auth-blob--3" />

      <div className="auth-container auth-container--wide">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="url(#grad2)"/>
              <defs>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7"/>
                  <stop offset="100%" stopColor="#ec4899"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="auth-logo__text">Streamify</span>
        </div>

        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Create your account</h1>
            <p className="auth-card__subtitle">Join millions of creators and viewers</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          {/* Cover Image Upload */}
          <div className="auth-cover-wrapper" id="register-cover-upload" onClick={() => coverRef.current?.click()}>
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="auth-cover-preview" />
            ) : (
              <div className="auth-cover-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span>Click to add cover image (optional)</span>
              </div>
            )}
            <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} id="register-cover-input" />
          </div>

          {/* Avatar */}
          <div className="auth-avatar-row">
            <div className="auth-avatar-wrapper" id="register-avatar-upload" onClick={() => avatarRef.current?.click()}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="auth-avatar-preview" />
              ) : (
                <div className="auth-avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
              <div className="auth-avatar-badge">
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </div>
              <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} id="register-avatar-input" />
            </div>
            <p className="auth-avatar-hint">Avatar <span className="auth-required">*</span></p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} id="register-form">
            <div className="auth-form__row">
              <div className="auth-field">
                <label htmlFor="register-fullname" className="auth-label">Full Name <span className="auth-required">*</span></label>
                <div className="auth-input-wrapper">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input id="register-fullname" name="fullName" type="text" className="auth-input" placeholder="John Doe" value={form.fullName} onChange={handleChange} />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="register-username" className="auth-label">Username <span className="auth-required">*</span></label>
                <div className="auth-input-wrapper">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input id="register-username" name="username" type="text" className="auth-input" placeholder="johndoe" value={form.username} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email" className="auth-label">Email <span className="auth-required">*</span></label>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input id="register-email" name="email" type="email" className="auth-input" placeholder="john@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
            </div>

            <div className="auth-form__row">
              <div className="auth-field">
                <label htmlFor="register-password" className="auth-label">Password <span className="auth-required">*</span></label>
                <div className="auth-input-wrapper">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(p => !p)} id="register-toggle-password">
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="register-confirm" className="auth-label">Confirm Password <span className="auth-required">*</span></label>
                <div className="auth-input-wrapper">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input id="register-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`auth-btn auth-btn--primary ${loading ? 'auth-btn--loading' : ''}`}
              id="register-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <><span className="auth-spinner" />Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link" id="go-to-login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
