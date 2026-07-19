import React, { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, VideoOff, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { getVideos } from '../services/api';
import './ExplorePage.css';

const categories = ['All', 'Tech', 'Music', 'Gaming', 'Travel', 'Food', 'Design', 'Sports', 'News', 'Comedy', 'Science', 'Finance'];

// ── Helpers (same as HomePage) ──────────────────────────────────────────────
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
  if (!videoFile || !videoFile.includes('cloudinary.com')) {
    return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  }
  const match = videoFile.match(/cloudinary\.com\/([^/]+)\/(?:video|image)\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  if (!match) return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  const [, cloudName, publicId] = match;
  if (videoFile.includes('/video/upload/')) {
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_30p,w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
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

// ── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Component ────────────────────────────────────────────────────────────────
const ExplorePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { limit: 30, sortBy: 'createdAt', sortType: 'desc' };
      if (activeCategory !== 'All') params.category = activeCategory;
      if (debouncedSearch.trim()) params.query = debouncedSearch.trim();

      const res = await getVideos(params);
      const docs = res?.data?.docs ?? res?.data ?? [];
      setVideos(Array.isArray(docs) ? docs : []);
    } catch (err: any) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos. Please try again.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const clearSearch = () => setSearch('');

  const sectionLabel = search
    ? `Results for "${debouncedSearch}"`
    : activeCategory === 'All'
    ? 'All Videos'
    : activeCategory;

  return (
    <div className="page-container explore-page">
      {/* Header */}
      <div className="explore-header">
        <h1 className="explore-title">
          <TrendingUp size={24} className="explore-icon" />
          Explore &amp; Search
        </h1>
        <div className="explore-search-wrap search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="search"
            className="search-input"
            placeholder="Search videos, creators, topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="explore-search-input"
          />
          {search && (
            <button
              className="explore-clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
              id="explore-clear-btn"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="h-scroll categories-scroll" style={{ marginBottom: '24px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`tag ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            id={`explore-cat-${cat.toLowerCase()}`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Section header */}
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h2 className="section-title">
          <span className="section-title-accent" />
          {sectionLabel}
        </h2>
        {loading ? (
          <span className="section-link explore-count">Loading…</span>
        ) : (
          <span className="section-link explore-count">{videos.length} video{videos.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="explore-loading">
          <Loader2 size={36} className="explore-spinner" />
          <p>Fetching videos…</p>
        </div>
      ) : error ? (
        <div className="explore-empty">
          <VideoOff size={40} />
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchVideos} id="explore-retry-btn">
            Retry
          </button>
        </div>
      ) : videos.length > 0 ? (
        <div className="video-grid animate-fadeInUp">
          {videos.map(v => (
            <Link key={v._id} to={`/watch/${v._id}`} style={{ textDecoration: 'none' }}>
              <VideoCard {...toCardProps(v)} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="explore-empty">
          <VideoOff size={40} />
          <h3>{search ? 'No results found' : 'No videos yet'}</h3>
          <p>
            {search
              ? 'Try a different search term or category'
              : activeCategory !== 'All'
              ? `No videos in "${activeCategory}" yet`
              : 'Upload a video to get started!'}
          </p>
          {(search || activeCategory !== 'All') && (
            <button
              className="btn btn-secondary"
              onClick={() => { clearSearch(); setActiveCategory('All'); }}
              id="explore-reset-btn"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
