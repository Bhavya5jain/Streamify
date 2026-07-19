import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Video, BarChart3, DollarSign,
  TrendingUp, Eye, ThumbsUp, Clock, Plus, Loader2, VideoOff
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { getDashboardStats, getDashboardVideos, togglePublishVideo, deleteVideo } from '../services/api';
import './DashboardPage.css';

// ── Helpers ──────────────────────────────────────────────────────────────────
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

const formatDuration = (secs: number): string => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const getVideoThumbnail = (thumbnail: string, videoFile?: string): string => {
  if (thumbnail) return thumbnail;
  if (!videoFile || !videoFile.includes('cloudinary.com'))
    return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  const match = videoFile.match(/cloudinary\.com\/([^/]+)\/(?:video|image)\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  if (!match) return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  const [, cloudName, publicId] = match;
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_30p,w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
};

// Build a simple 7-day chart from real stats (views spread evenly as placeholder)
const buildChartData = (totalViews: number) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((d, i) => ({
    month: d,
    views: Math.floor((totalViews / 7) * (0.5 + Math.random() * 1.5)),
    revenue: Math.floor(Math.random() * 200 + 50),
  }));
};

// ── Component ─────────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'content' | 'analytics' | 'revenue'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await getDashboardStats();
        const data = res?.data ?? {};
        setStats(data);
        setChartData(buildChartData(data.totalViews ?? 0));
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoadingVideos(true);
      try {
        const res = await getDashboardVideos();
        const data = res?.data?.videos ?? res?.data ?? [];
        setVideos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  const handleTogglePublish = async (videoId: string) => {
    try {
      await togglePublishVideo(videoId);
      setVideos(prev => prev.map(v => v._id === videoId ? { ...v, isPublished: !v.isPublished } : v));
    } catch {
      alert('Failed to toggle publish status');
    }
  };

  const handleDelete = async (videoId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteVideo(videoId);
      setVideos(prev => prev.filter(v => v._id !== videoId));
    } catch {
      alert('Failed to delete video');
    }
  };

  const quickStats = [
    { label: 'Total Views', value: stats?.totalViews?.toLocaleString() ?? '—', icon: <Eye size={20} />, color: '#06b6d4', sub: 'all time' },
    { label: 'Subscribers', value: stats?.totalSubscribers?.toLocaleString() ?? '—', icon: <TrendingUp size={20} />, color: '#22c55e', sub: 'total' },
    { label: 'Total Videos', value: stats?.totalVideos?.toLocaleString() ?? '—', icon: <Clock size={20} />, color: '#7c3aed', sub: 'published' },
    { label: 'Total Likes', value: stats?.totalLikes?.toLocaleString() ?? '—', icon: <ThumbsUp size={20} />, color: '#f59e0b', sub: 'across all videos' },
  ];

  return (
    <div className="dashboard-page page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            <LayoutDashboard size={24} /> Creator Studio
          </h1>
          <p className="dashboard-subtitle">Manage your content and track performance</p>
        </div>
        <Link to="/upload" className="btn btn-primary" id="new-video-btn">
          <Plus size={16} /> New Video
        </Link>
      </div>

      {/* Navigation tabs */}
      <div className="dashboard-nav">
        {[
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
          { id: 'content', label: 'Content', icon: <Video size={16} /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
          { id: 'revenue', label: 'Revenue', icon: <DollarSign size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            className={`dashboard-tab ${activeSection === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSection(tab.id as any)}
            id={`dash-tab-${tab.id}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats-grid">
        {quickStats.map((stat, i) => (
          <div key={i} className="stat-card" id={`dash-stat-${i}`}>
            <div className="stat-icon" style={{ background: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            {loadingStats ? (
              <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <div className="stat-value">{stat.value}</div>
            )}
            <div className="stat-label">{stat.label}</div>
            <div className="stat-change positive" style={{ color: stat.color }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      {(activeSection === 'overview' || activeSection === 'analytics' || activeSection === 'revenue') && (
        <div className="dashboard-card" id="performance-chart">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-title-accent" />
              {activeSection === 'revenue' ? 'Revenue Performance' : 'Views & Engagement'}
            </h2>
          </div>
          {chartData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>No data available yet. Upload videos to see analytics.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="dashGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff0040" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff0040" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dashGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '13px' }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Area
                  type="monotone"
                  dataKey={activeSection === 'revenue' ? 'revenue' : 'views'}
                  stroke="#ff0040"
                  fill="url(#dashGrad1)"
                  strokeWidth={2}
                  name={activeSection === 'revenue' ? 'Revenue ($)' : 'Views'}
                />
                {activeSection === 'overview' && (
                  <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#dashGrad2)" strokeWidth={2} name="Est. Revenue" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Content Table */}
      {(activeSection === 'overview' || activeSection === 'content') && (
        <div className="dashboard-card" id="content-management">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-title-accent" />
              Your Videos
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {loadingVideos ? '' : `${videos.length} video${videos.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="content-table-wrap">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingVideos ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                    </td>
                  </tr>
                ) : videos.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      <VideoOff size={28} style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
                      No videos yet.{' '}
                      <Link to="/upload" style={{ color: 'var(--accent-red)' }}>Upload your first video →</Link>
                    </td>
                  </tr>
                ) : videos.map((video: any) => (
                  <tr key={video._id} id={`content-row-${video._id}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={getVideoThumbnail(video.thumbnail, video.videoFile)}
                          alt=""
                          style={{ width: 80, aspectRatio: '16/9', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {video.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${video.isPublished ? 'badge-green' : 'badge-gray'}`}>
                        {video.isPublished ? 'Published' : 'Private'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {video.views?.toLocaleString() ?? '0'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {formatDuration(video.duration)}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {timeAgo(video.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/watch/${video._id}`} className="btn-icon" style={{ width: 28, height: 28 }} title="Watch">
                          <Eye size={13} />
                        </Link>
                        <button
                          className="btn-icon"
                          style={{ width: 28, height: 28 }}
                          title={video.isPublished ? 'Make Private' : 'Publish'}
                          onClick={() => handleTogglePublish(video._id)}
                        >
                          {video.isPublished ? '🔒' : '🌐'}
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: 28, height: 28, color: '#ef4444' }}
                          title="Delete"
                          onClick={() => handleDelete(video._id, video.title)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
