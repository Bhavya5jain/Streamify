import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Settings, Grid3X3, ListVideo,
  History, ThumbsUp, MessageSquare, Bell, BellOff,
  Edit, Camera, Loader2, VideoOff, Upload
} from 'lucide-react';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';
import { useAuth } from '../context/AuthContext';
import {
  getCurrentUser, getVideos, getUserPlaylists,
  getWatchHistory, getLikedVideos,
  getUserTweets, updateAccountDetails,
  toggleSubscription, getSubscriptionStatus,
} from '../services/api';
import './ProfilePage.css';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';

const timeAgo = (iso: string) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const formatDuration = (secs: number) => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60), s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const getVideoThumbnail = (thumbnail: string, videoFile: string): string => {
  if (thumbnail) return thumbnail;
  if (!videoFile || !videoFile.includes('cloudinary.com')) return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  const match = videoFile.match(/cloudinary\.com\/([^/]+)\/(?:video|image)\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  if (!match) return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  const [, cloudName, publicId] = match;
  if (videoFile.includes('/video/upload/')) {
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_30p,w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
};

const toCardProps = (v: any) => ({
  id: v._id,
  title: v.title,
  thumbnail: getVideoThumbnail(v.thumbnail, v.videoFile),
  duration: formatDuration(v.duration),
  views: v.views?.toLocaleString() ?? '0',
  uploadedAt: timeAgo(v.createdAt),
  channel: {
    name: v.owner?.fullName || v.owner?.username || 'Unknown',
    avatar: v.owner?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${v.owner?.username}`,
    verified: false,
  },
});

type Tab = 'videos' | 'playlists' | 'history' | 'liked' | 'tweets' | 'settings';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'videos',    label: 'Videos',    icon: <Grid3X3 size={16} /> },
  { id: 'playlists', label: 'Playlists', icon: <ListVideo size={16} /> },
  { id: 'history',   label: 'History',   icon: <History size={16} /> },
  { id: 'liked',     label: 'Liked',     icon: <ThumbsUp size={16} /> },
  { id: 'tweets',    label: 'Posts',     icon: <MessageSquare size={16} /> },
  { id: 'settings',  label: 'Settings',  icon: <Settings size={16} /> },
];

const ProfilePage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [loading, setLoading] = useState(true);

  // Profile data
  const [profileUser, setProfileUser] = useState<any>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  // Tab data
  const [videos, setVideos] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [liked, setLiked] = useState<any[]>([]);
  const [tweets, setTweets] = useState<any[]>([]);
  const [tabLoading, setTabLoading] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({ fullName: '', username: '' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  // Avatar upload
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  // ── Initial load ──
  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    const init = async () => {
      setLoading(true);
      try {
        const [userRes, videosRes] = await Promise.all([
          getCurrentUser(),
          getVideos({ userId: user?._id, limit: 20, sortBy: 'createdAt', sortType: 'desc' }).catch(() => ({ data: { docs: [] } })),
        ]);
        const u = userRes?.data;
        setProfileUser(u);
        setSettingsForm({ fullName: u?.fullName ?? '', username: u?.username ?? '' });

        const docs = videosRes?.data?.docs ?? videosRes?.data ?? [];
        const vids = Array.isArray(docs) ? docs : [];
        setVideos(vids);
        setTotalViews(vids.reduce((acc: number, v: any) => acc + (v.views ?? 0), 0));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    init();
  }, [isLoggedIn, user?._id]);

  // ── Load tab data lazily ──
  useEffect(() => {
    if (!isLoggedIn || !profileUser) return;
    const load = async () => {
      setTabLoading(true);
      try {
        if (activeTab === 'playlists' && playlists.length === 0) {
          const res = await getUserPlaylists().catch(() => ({ data: [] }));
          setPlaylists(res?.data ?? []);
        }
        if (activeTab === 'history' && history.length === 0) {
          const res = await getWatchHistory().catch(() => ({ data: [] }));
          setHistory(Array.isArray(res?.data) ? res.data : []);
        }
        if (activeTab === 'liked' && liked.length === 0) {
          const res = await getLikedVideos().catch(() => ({ data: [] }));
          // liked videos API returns like docs with populated video field
          const items = res?.data?.docs ?? res?.data ?? [];
          setLiked(Array.isArray(items) ? items : []);
        }
        if (activeTab === 'tweets' && tweets.length === 0) {
          const res = await getUserTweets(profileUser._id).catch(() => ({ data: [] }));
          const items = res?.data?.docs ?? res?.data ?? [];
          setTweets(Array.isArray(items) ? items : []);
        }
      } catch (e) { console.error(e); }
      finally { setTabLoading(false); }
    };
    load();
  }, [activeTab, profileUser]);

  // ── Avatar upload ──
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch(`${BASE_URL}/users/updateUserAvatar`, {
        method: 'PATCH', body: fd, credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) setProfileUser((prev: any) => ({ ...prev, avtar: data?.data?.avtar }));
    } catch (e) { console.error(e); }
    finally { setAvatarUploading(false); }
  };

  // ── Cover upload ──
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const fd = new FormData();
      fd.append('coverImage', file);
      const res = await fetch(`${BASE_URL}/users/updateUsercoverImage`, {
        method: 'PATCH', body: fd, credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) setProfileUser((prev: any) => ({ ...prev, coverImage: data?.data?.coverImage }));
    } catch (e) { console.error(e); }
    finally { setCoverUploading(false); }
  };

  // ── Save settings ──
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsError('');
    setSettingsSaved(false);
    try {
      const res = await updateAccountDetails(settingsForm);
      if (res?.data) {
        setProfileUser((prev: any) => ({ ...prev, ...res.data }));
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
      }
    } catch (e: any) {
      setSettingsError(e.message || 'Failed to save');
    } finally { setSavingSettings(false); }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
      </div>
    );
  }

  const isOwnProfile = true; // ProfilePage is always the logged-in user's profile

  return (
    <div className="profile-page">
      {/* Banner */}
      <div className="profile-banner" id="profile-banner">
        {profileUser?.coverImage
          ? <img src={profileUser.coverImage} alt="Cover" className="banner-img" />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)' }} />
        }
        <div className="banner-overlay" />
        <button
          className="banner-edit-btn"
          onClick={() => coverInputRef.current?.click()}
          disabled={coverUploading}
        >
          {coverUploading
            ? <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} />
            : <Camera size={14} />
          }
          {coverUploading ? 'Uploading...' : 'Edit Banner'}
        </button>
        <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
      </div>

      <div className="page-container">
        <div className="profile-header">
          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <img
              src={profileUser?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser?.username}`}
              alt={profileUser?.fullName}
              className="avatar avatar-3xl profile-avatar"
            />
            <button
              className="avatar-edit-btn"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              title="Change avatar"
            >
              {avatarUploading
                ? <Loader2 size={12} style={{ animation: 'spin 0.7s linear infinite' }} />
                : <Camera size={13} />
              }
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="profile-info">
            <div className="profile-name-row">
              <h1 className="profile-name">
                {profileUser?.fullName || 'Your Channel'}
              </h1>
              <Link to="/settings" className="btn btn-secondary profile-edit-btn">
                <Edit size={14} /> Edit Profile
              </Link>
            </div>

            <div className="profile-handle">@{profileUser?.username}</div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-val">{subscriberCount.toLocaleString()}</span>
                <span className="stat-lbl">Subscribers</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="stat-val">{videos.length}</span>
                <span className="stat-lbl">Videos</span>
              </div>
              <div className="profile-stat-divider" />
              <div className="profile-stat">
                <span className="stat-val">{totalViews.toLocaleString()}</span>
                <span className="stat-lbl">Total Views</span>
              </div>
            </div>

            <p className="profile-bio">{profileUser?.email}</p>
          </div>

          {/* Actions — subscribe hidden for own profile */}
          {!isOwnProfile && (
            <div className="profile-actions">
              <button
                className={`btn ${subscribed ? 'btn-secondary' : 'btn-red'}`}
                onClick={() => {}}
                id="profile-subscribe-btn"
              >
                {subscribed ? <><BellOff size={16} /> Subscribed</> : <><Bell size={16} /> Subscribe</>}
              </button>
            </div>
          )}
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
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="profile-tab-content" role="tabpanel">

          {/* Videos */}
          {activeTab === 'videos' && (
            tabLoading ? <TabLoader /> :
            videos.length === 0 ? (
              <EmptyState icon={<VideoOff size={40} />} message="No videos yet.">
                <Link to="/upload" className="btn btn-primary" style={{ marginTop: 16 }}>
                  <Upload size={15} /> Upload First Video
                </Link>
              </EmptyState>
            ) : (
              <div className="video-grid animate-fadeInUp">
                {videos.map((v: any) => <VideoCard key={v._id} {...toCardProps(v)} />)}
              </div>
            )
          )}

          {/* Playlists */}
          {activeTab === 'playlists' && (
            tabLoading ? <TabLoader /> :
            playlists.length === 0 ? (
              <EmptyState icon={<ListVideo size={40} />} message="No playlists yet." />
            ) : (
              <div className="video-grid-sm animate-fadeInUp">
                {playlists.map((pl: any) => (
                  <Link key={pl._id} to={`/playlist/${pl._id}`} className="playlist-card glass-card">
                    <div className="playlist-thumb-wrap">
                      {pl.videos?.[0]?.thumbnail
                        ? <img src={pl.videos[0].thumbnail} alt={pl.name} className="playlist-thumb" />
                        : <div style={{ width: '100%', height: '100%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ListVideo size={32} style={{ color: 'var(--text-muted)' }} />
                          </div>
                      }
                      <div className="playlist-count-overlay">
                        <ListVideo size={15} /> {pl.videos?.length ?? 0} videos
                      </div>
                    </div>
                    <div className="playlist-info">
                      <h3 className="playlist-name">{pl.name}</h3>
                      <p className="playlist-updated">{pl.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}

          {/* History */}
          {activeTab === 'history' && (
            tabLoading ? <TabLoader /> :
            history.length === 0 ? (
              <EmptyState icon={<History size={40} />} message="No watch history yet." />
            ) : (
              <div className="video-grid animate-fadeInUp">
                {history.map((v: any) => <VideoCard key={v._id} {...toCardProps(v)} />)}
              </div>
            )
          )}

          {/* Liked */}
          {activeTab === 'liked' && (
            tabLoading ? <TabLoader /> :
            liked.length === 0 ? (
              <EmptyState icon={<ThumbsUp size={40} />} message="No liked videos yet." />
            ) : (
              <div className="video-grid animate-fadeInUp">
                {liked.map((item: any) => {
                  const v = item.video ?? item;
                  return <VideoCard key={v._id} {...toCardProps(v)} />;
                })}
              </div>
            )
          )}

          {/* Tweets / Posts */}
          {activeTab === 'tweets' && (
            tabLoading ? <TabLoader /> :
            tweets.length === 0 ? (
              <EmptyState icon={<MessageSquare size={40} />} message="No posts yet." />
            ) : (
              <div className="tweets-tab animate-fadeInUp">
                {tweets.map((t: any) => <TweetCard key={t._id} tweet={t} />)}
              </div>
            )
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="settings-tab animate-fadeInUp">
              <div className="settings-card">
                <h3 className="settings-card-title">Account Settings</h3>
                <form className="settings-form" onSubmit={handleSaveSettings}>
                  <div className="form-group">
                    <label className="label">Full Name</label>
                    <input
                      type="text" className="input"
                      value={settingsForm.fullName}
                      onChange={e => setSettingsForm(f => ({ ...f, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Username</label>
                    <input
                      type="text" className="input"
                      value={settingsForm.username}
                      onChange={e => setSettingsForm(f => ({ ...f, username: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Email</label>
                    <input type="email" className="input" value={profileUser?.email ?? ''} disabled style={{ opacity: 0.5 }} />
                  </div>
                  {settingsError && (
                    <p style={{ color: '#f87171', fontSize: 13 }}>{settingsError}</p>
                  )}
                  <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                    {savingSettings ? 'Saving...' : settingsSaved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </form>
              </div>

              <div className="settings-card">
                <h3 className="settings-card-title">Profile Picture</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <img
                    src={profileUser?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser?.username}`}
                    alt=""
                    className="avatar"
                    style={{ width: 64, height: 64, borderRadius: '50%' }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? 'Uploading...' : 'Change Avatar'}
                  </button>
                </div>
              </div>

              <div className="settings-card danger-zone">
                <h3 className="settings-card-title" style={{ color: '#f87171' }}>Danger Zone</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
                  Once you delete your account, there is no going back.
                </p>
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

// ── Small helpers ──
const TabLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
    <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
  </div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; message: string; children?: React.ReactNode }> = ({ icon, message, children }) => (
  <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
    {icon}
    <p>{message}</p>
    {children}
  </div>
);

export default ProfilePage;
