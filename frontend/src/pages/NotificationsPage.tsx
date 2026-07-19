import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Settings, Loader2, VideoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVideos } from '../services/api';

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRecentVideos = async () => {
      setLoading(true);
      try {
        const res = await getVideos({ limit: 20, sortBy: 'createdAt', sortType: 'desc' });
        const docs = res?.data?.docs ?? res?.data ?? [];
        setNotifications(Array.isArray(docs) ? docs : []);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentVideos();
  }, []);

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n: any) => n._id)));
  };

  const markRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  const unreadCount = notifications.filter(n => !readIds.has(n._id)).length;

  return (
    <div className="page-container" style={{ paddingTop: '24px', maxWidth: '700px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={22} style={{ color: 'var(--accent-red)' }} />
          Notifications
          {unreadCount > 0 && (
            <span style={{
              background: 'var(--accent-red)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '999px',
              padding: '2px 8px',
              minWidth: '20px',
              textAlign: 'center',
            }}>
              {unreadCount}
            </span>
          )}
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {unreadCount > 0 && (
            <button
              className="btn btn-ghost"
              onClick={markAllRead}
              id="mark-all-read-btn"
              style={{ fontSize: '13px', gap: '6px' }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          <button className="btn-icon" id="notif-settings-btn" aria-label="Notification settings">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <Loader2 size={36} style={{ color: 'var(--accent-red)', animation: 'spin 1s linear infinite' }} />
          <p>Loading notifications…</p>
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <Bell size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-secondary)' }}>No notifications yet</h3>
          <p>New video uploads and activity will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map((video: any) => {
            const isRead = readIds.has(video._id);
            const avatar = video.owner?.avtar
              || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.owner?.username}`;
            const channelName = video.owner?.fullName || video.owner?.username || 'Unknown';

            return (
              <Link
                to={`/watch/${video._id}`}
                key={video._id}
                id={`notif-page-${video._id}`}
                onClick={() => markRead(video._id)}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 16px',
                    background: isRead ? 'var(--bg-glass)' : 'rgba(255,0,64,0.04)',
                    border: `1px solid ${isRead ? 'var(--border-subtle)' : 'rgba(255,0,64,0.12)'}`,
                    borderRadius: 'var(--radius-lg)',
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = isRead ? 'var(--bg-glass)' : 'rgba(255,0,64,0.04)')}
                >
                  {/* Channel avatar */}
                  <img src={avatar} alt={channelName} className="avatar avatar-md" style={{ flexShrink: 0 }} />

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{channelName}</strong>
                      {' '}uploaded a new video:{' '}
                      <em style={{ color: 'var(--accent-red)', fontStyle: 'normal', fontWeight: 600 }}>
                        "{video.title}"
                      </em>
                    </p>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      {timeAgo(video.createdAt)}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt=""
                      style={{ width: 72, aspectRatio: '16/9', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                  )}

                  {/* Unread dot */}
                  {!isRead && (
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: 'var(--accent-red)', flexShrink: 0, marginTop: '6px',
                    }} />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
