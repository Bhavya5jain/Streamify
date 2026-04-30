import React, { useState } from 'react';
import { ThumbsUp, Play, Shuffle, Grid3X3, List, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { mockVideos } from '../data/mockData';
import './LikedVideosPage.css';

// Simulate liked videos — every video with a liked timestamp
const likedVideos = mockVideos.map((v, i) => ({
  ...v,
  likedAt: ['Just now', '2 hours ago', 'Yesterday', '3 days ago', '1 week ago', '2 weeks ago', '1 month ago', '2 months ago'][i % 8],
}));

type ViewMode = 'grid' | 'list';
type SortBy = 'recent' | 'oldest' | 'popular';

const LikedVideosPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [videos, setVideos] = useState(likedVideos);

  const sorted = [...videos].sort((a, b) => {
    if (sortBy === 'popular') return parseInt(b.views) - parseInt(a.views);
    return 0; // keep original order for recent/oldest (mock)
  });

  const unlike = (id: string) => setVideos(prev => prev.filter(v => v.id !== id));

  return (
    <div className="liked-page page-container">
      {/* Hero / Header */}
      <div className="liked-hero">
        <div className="liked-hero-bg" />
        <div className="liked-hero-content">
          <div className="liked-hero-icon">
            <ThumbsUp size={36} fill="currentColor" />
          </div>
          <div className="liked-hero-text">
            <h1 className="liked-title">Liked Videos</h1>
            <p className="liked-subtitle">
              {videos.length} videos · Playlist by you
            </p>
          </div>
          <div className="liked-hero-actions">
            <button className="btn btn-primary" id="liked-play-all">
              <Play size={16} fill="white" /> Play All
            </button>
            <button className="btn btn-secondary" id="liked-shuffle">
              <Shuffle size={16} /> Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="liked-toolbar">
        <div className="liked-toolbar-left">
          <span className="toolbar-label">Sort by:</span>
          {(['recent', 'oldest', 'popular'] as SortBy[]).map(s => (
            <button
              key={s}
              className={`tag ${sortBy === s ? 'active' : ''}`}
              onClick={() => setSortBy(s)}
              id={`sort-${s}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="liked-toolbar-right">
          <button
            className={`btn-icon ${viewMode === 'grid' ? 'view-active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            id="view-grid-btn"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            className={`btn-icon ${viewMode === 'list' ? 'view-active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
            id="view-list-btn"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Videos */}
      {videos.length === 0 ? (
        <div className="liked-empty">
          <div className="liked-empty-icon">
            <Heart size={48} />
          </div>
          <h2>No liked videos yet</h2>
          <p>Videos you like will appear here. Hit the 👍 button on any video!</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '8px' }}>
            Browse Videos
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="video-grid animate-fadeInUp">
          {sorted.map(video => (
            <div key={video.id} className="liked-card-wrap">
              <VideoCard {...video} />
              <button
                className="unlike-btn"
                onClick={() => unlike(video.id)}
                title="Unlike"
                aria-label={`Unlike ${video.title}`}
              >
                <ThumbsUp size={13} fill="currentColor" /> Unlike
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="liked-list animate-fadeInUp">
          {sorted.map((video, i) => (
            <div key={video.id} className="liked-list-item" id={`liked-item-${video.id}`}>
              <span className="liked-list-index">{i + 1}</span>
              <Link to={`/watch/${video.id}`} className="liked-list-thumb">
                <img src={video.thumbnail} alt={video.title} />
                <div className="liked-list-duration">{video.duration}</div>
              </Link>
              <div className="liked-list-info">
                <Link to={`/watch/${video.id}`} className="liked-list-title">{video.title}</Link>
                <div className="liked-list-meta">
                  <img src={video.channel.avatar} alt="" className="avatar" style={{ width: 18, height: 18, borderRadius: '50%' }} />
                  {video.channel.name} · {video.views} views · {video.uploadedAt}
                </div>
              </div>
              <span className="liked-at">{video.likedAt}</span>
              <button
                className="unlike-btn-list"
                onClick={() => unlike(video.id)}
                title="Unlike"
              >
                <ThumbsUp size={15} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideosPage;
