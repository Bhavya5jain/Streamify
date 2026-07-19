import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, VideoOff, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { getWatchHistory, clearWatchHistory } from '../services/api';

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDuration = (secs: number): string => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const getVideoThumbnail = (thumbnail: string, videoFile: string): string => {
  if (thumbnail) return thumbnail;
  if (!videoFile || !videoFile.includes('cloudinary.com'))
    return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  const match = videoFile.match(/cloudinary\.com\/([^/]+)\/(?:video|image)\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  if (!match) return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  const [, cloudName, publicId] = match;
  return videoFile.includes('/video/upload/')
    ? `https://res.cloudinary.com/${cloudName}/video/upload/so_30p,w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`
    : `https://res.cloudinary.com/${cloudName}/image/upload/w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
};

const toCardProps = (video: any) => ({
  id: video._id,
  title: video.title,
  thumbnail: getVideoThumbnail(video.thumbnail, video.videoFile),
  duration: formatDuration(video.duration),
  views: video.views?.toLocaleString() ?? '0',
  uploadedAt: timeAgo(video.createdAt),
  channel: {
    name: video.owner?.fullName || video.owner?.username || 'Unknown',
    avatar: video.owner?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.owner?.username}`,
    verified: false,
  },
});

// Group videos by how long ago they were watched
const groupByTime = (videos: any[]) => {
  const now = Date.now();
  const groups: Record<string, any[]> = { Today: [], Yesterday: [], 'This Week': [], Older: [] };
  videos.forEach(v => {
    const diff = now - new Date(v.createdAt).getTime();
    const days = diff / 86400000;
    if (days < 1) groups['Today'].push(v);
    else if (days < 2) groups['Yesterday'].push(v);
    else if (days < 7) groups['This Week'].push(v);
    else groups['Older'].push(v);
  });
  return groups;
};

// ── Component ─────────────────────────────────────────────────────────────────
const HistoryPage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWatchHistory();
      // API returns the array directly as data
      const history = res?.data ?? [];
      setVideos(Array.isArray(history) ? [...history].reverse() : []);
    } catch (err: any) {
      setError('Failed to load watch history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear your entire watch history?')) return;
    setClearing(true);
    try {
      await clearWatchHistory();
      setVideos([]);
    } catch {
      alert('Failed to clear history. Please try again.');
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const groups = groupByTime(videos);
  const hasVideos = videos.length > 0;

  return (
    <div className="page-container" style={{ paddingTop: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HistoryIcon size={22} style={{ color: 'var(--accent-red)' }} />
          Watch History
          {!loading && hasVideos && (
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>
              ({videos.length} video{videos.length !== 1 ? 's' : ''})
            </span>
          )}
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-ghost"
            id="refresh-history-btn"
            onClick={fetchHistory}
            disabled={loading}
            style={{ gap: '6px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
          {hasVideos && (
            <button
              className="btn btn-ghost"
              id="clear-history-btn"
              onClick={handleClearHistory}
              disabled={clearing}
              style={{ gap: '6px', fontSize: '13px', color: 'var(--accent-red)' }}
            >
              <Trash2 size={14} /> {clearing ? 'Clearing…' : 'Clear History'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <Loader2 size={36} style={{ color: 'var(--accent-red)', animation: 'spin 1s linear infinite' }} />
          <p>Loading your watch history…</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <VideoOff size={48} style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Something went wrong</h3>
          <p style={{ marginBottom: '16px' }}>{error}</p>
          <button className="btn btn-secondary" onClick={fetchHistory} id="history-retry-btn">Retry</button>
        </div>
      ) : !hasVideos ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <VideoOff size={48} style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-secondary)' }}>No watch history yet</h3>
          <p style={{ marginBottom: '16px' }}>Videos you watch will appear here.</p>
          <Link to="/" className="btn btn-primary" id="history-browse-btn">Browse Videos</Link>
        </div>
      ) : (
        Object.entries(groups).map(([label, groupVideos]) =>
          groupVideos.length > 0 && (
            <div key={label} style={{ marginBottom: '36px' }}>
              <h2 style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                {label}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {groupVideos.map(v => (
                  <VideoCard key={v._id} {...toCardProps(v)} compact />
                ))}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default HistoryPage;
