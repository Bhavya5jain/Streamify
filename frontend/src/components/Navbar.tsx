import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Bell, Upload, Menu, X, ChevronDown,
  Settings, LogOut, User, LayoutDashboard, Bookmark,
  CheckCircle2, LogIn
} from 'lucide-react';
import { mockNotifications, currentUser } from '../data/mockData';
import './Navbar.css';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  // TODO: replace with real auth context during integration
  const [isLoggedIn] = useState(true);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button
            className="btn-icon menu-btn"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            id="sidebar-toggle-btn"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="navbar-logo" id="navbar-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ff0040"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text gradient-text">Streamify</span>
          </Link>
        </div>

        <form className="navbar-search" onSubmit={handleSearch} role="search">
          <div className="search-input-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="search"
              placeholder="Search videos, creators..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
              id="navbar-search-input"
              aria-label="Search"
            />
          </div>
          <button type="submit" className="search-btn" id="navbar-search-btn" aria-label="Search">
            <Search size={16} />
          </button>
        </form>

        <div className="navbar-right">
          {isLoggedIn && (
            <button
              className="btn btn-primary upload-btn"
              onClick={() => navigate('/upload')}
              id="upload-nav-btn"
            >
              <Upload size={16} />
              <span>Upload</span>
            </button>
          )}

          {/* Notifications */}
          <div className="notif-wrapper" ref={notifRef}>
            <button
              className="btn-icon notif-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              id="notifications-btn"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="dropdown notif-dropdown" id="notifications-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-title">Notifications</span>
                  <button className="mark-read-btn">Mark all read</button>
                </div>
                <div className="notif-list">
                  {mockNotifications.map(notif => (
                    <div key={notif.id} className={`notif-item ${!notif.read ? 'unread' : ''}`}>
                      <img src={notif.avatar} alt={notif.user} className="avatar avatar-sm" />
                      <div className="notif-content">
                        <p className="notif-text">
                          <strong>{notif.user}</strong> {notif.message}
                          {notif.title && <em> "{notif.title}"</em>}
                        </p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                      {!notif.read && <span className="notif-dot-sm"></span>}
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <Link to="/notifications" className="view-all-btn">View all notifications</Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu / Sign In */}
          {isLoggedIn ? (
            <div className="user-menu-wrapper" ref={userRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="user-avatar-btn"
                aria-label="User menu"
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="avatar avatar-sm" />
                <ChevronDown size={14} className={`chevron ${showUserMenu ? 'open' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="dropdown user-dropdown" id="user-menu-dropdown">
                  <div className="user-menu-header">
                    <img src={currentUser.avatar} alt={currentUser.name} className="avatar avatar-md" />
                    <div>
                      <div className="user-menu-name">{currentUser.name}</div>
                      <div className="user-menu-handle">{currentUser.handle}</div>
                    </div>
                  </div>
                  <hr className="divider" />
                  <Link to="/profile" className="dropdown-item" id="profile-menu-item">
                    <User size={16} /> Your Channel
                  </Link>
                  <Link to="/dashboard" className="dropdown-item" id="dashboard-menu-item">
                    <LayoutDashboard size={16} /> Creator Studio
                  </Link>
                  <Link to="/saved" className="dropdown-item" id="saved-menu-item">
                    <Bookmark size={16} /> Saved Playlists
                  </Link>
                  <Link to="/admin" className="dropdown-item" id="admin-menu-item">
                    <CheckCircle2 size={16} /> Admin Panel
                  </Link>
                  <hr className="divider" />
                  <Link to="/settings" className="dropdown-item" id="settings-menu-item">
                    <Settings size={16} /> Settings
                  </Link>
                  <button className="dropdown-item danger" id="logout-menu-item">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-signin" id="signin-nav-btn">
              <LogIn size={16} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
