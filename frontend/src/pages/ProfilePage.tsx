import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, MapPin, Globe, Twitter, Github,
  Settings, Grid3X3, ListVideo, History, ThumbsUp,
  MessageSquare, Bell, Edit, Camera
} from 'lucide-react';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';
import { mockVideos, mockPlaylists, mockTweets, currentUser } from '../data/mockData';
import './ProfilePage.css';

type Tab = 'videos' | 'playlists' | 'history' | 'liked' | 'tweets' | 'settings';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'videos', label: 'Videos', icon: <Grid3X3 size={16} /> },
  { id: 'playlists', label: 'Playlists', icon: <ListVideo size={16} /> },
  { id: 'history', label: 'History', icon: <History size={16} /> },
  { id: 'liked', label: 'Liked', icon: <ThumbsUp size={16} /> },
  { id: 'tweets', label: 'Posts', icon: <MessageSquare size={16} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="profile-page">
      {/* Banner */}
      <div className="profile-banner" id="profile-banner">
        <img src={currentUser.banner} alt="Profile banner" className="banner-img" />
        <div className="banner-overlay" />
        <button className="banner-edit-btn" aria-label="Edit banner">
          <Camera size={16} /> Edit Banner
        </button>
      </div>

      {/* Profile Header */}
      <div className="page-container">
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="avatar avatar-3xl profile-avatar"
            />
            <button className="avatar-edit-btn" aria-label="Change avatar">
              <Camera size={14} />
            </button>
          </div>

          <div className="profile-info">
            <div className="profile-name-row">
              <h1 className="profile-name">
                {currentUser.name}
                {currentUser.verified && <CheckCircle2 size={20} className="profile-verified" />}
              </h1>
              <Link to="/settings" className="btn btn-secondary profile-edit-btn">
                <Edit size={14} /> Edit Profile
              </Link>
            </div>

            <div className="profile-handle">{currentUser.handle}</div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-val">{currentUser.subscribers}</span>
                <span className="stat-lbl">Subscribers</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="stat-val">{currentUser.totalVideos}</span>
                <span className="stat-lbl">Videos</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="stat-val">{currentUser.totalViews}</span>
                <span className="stat-lbl">Total Views</span>
              </div>
            </div>

            <p className="profile-bio">{currentUser.bio}</p>

            <div className="profile-meta">
              {currentUser.location && (
                <span className="profile-meta-item">
                  <MapPin size={13} /> {currentUser.location}
                </span>
              )}
              {currentUser.website && (
                <a href={currentUser.website} className="profile-meta-item profile-link" target="_blank" rel="noreferrer">
                  <Globe size={13} /> {currentUser.website}
                </a>
              )}
              {currentUser.social.twitter && (
                <span className="profile-meta-item">
                  <Twitter size={13} /> {currentUser.social.twitter}
                </span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button
              className={`btn ${subscribed ? 'btn-secondary' : 'btn-red'}`}
              onClick={() => setSubscribed(!subscribed)}
              id="profile-subscribe-btn"
            >
              {subscribed ? <><Bell size={16} /> Subscribed</> : 'Subscribe'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="profile-tab-content" role="tabpanel">
          {activeTab === 'videos' && (
            <div className="video-grid animate-fadeInUp">
              {mockVideos.map(v => <VideoCard key={v.id} {...v} />)}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="video-grid-sm animate-fadeInUp">
              {mockPlaylists.map(playlist => (
                <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="playlist-card glass-card" id={`playlist-${playlist.id}`}>
                  <div className="playlist-thumb-wrap">
                    <img src={playlist.thumbnail} alt={playlist.name} className="playlist-thumb" />
                    <div className="playlist-count-overlay">
                      <ListVideo size={16} />
                      {playlist.videos} videos
                    </div>
                  </div>
                  <div className="playlist-info">
                    <h3 className="playlist-name">{playlist.name}</h3>
                    <p className="playlist-updated">Updated {playlist.updatedAt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="video-grid animate-fadeInUp">
              {[...mockVideos].reverse().map(v => <VideoCard key={v.id} {...v} />)}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="video-grid animate-fadeInUp">
              {mockVideos.filter((_, i) => i % 2 === 0).map(v => <VideoCard key={v.id} {...v} />)}
            </div>
          )}

          {activeTab === 'tweets' && (
            <div className="tweets-tab animate-fadeInUp">
              {mockTweets.map(t => <TweetCard key={t.id} tweet={t} />)}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab animate-fadeInUp">
              <div className="settings-card">
                <h3 className="settings-card-title">Account Settings</h3>
                <div className="settings-form">
                  {[
                    { id: 'display-name', label: 'Display Name', value: currentUser.name, type: 'text' },
                    { id: 'handle', label: 'Handle', value: currentUser.handle, type: 'text' },
                    { id: 'bio', label: 'Bio', value: currentUser.bio, type: 'textarea' },
                    { id: 'website', label: 'Website', value: currentUser.website, type: 'url' },
                    { id: 'location', label: 'Location', value: currentUser.location, type: 'text' },
                  ].map(field => (
                    <div key={field.id} className="form-group">
                      <label htmlFor={field.id} className="label">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea id={field.id} className="input" defaultValue={field.value} rows={3} />
                      ) : (
                        <input id={field.id} type={field.type} className="input" defaultValue={field.value} />
                      )}
                    </div>
                  ))}
                  <button className="btn btn-primary" id="save-settings-btn">Save Changes</button>
                </div>
              </div>

              <div className="settings-card danger-zone">
                <h3 className="settings-card-title" style={{ color: '#f87171' }}>Danger Zone</h3>
                <button className="btn btn-ghost" style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
