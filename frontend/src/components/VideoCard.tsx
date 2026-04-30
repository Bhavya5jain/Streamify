import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, CheckCircle2, MoreVertical, Bookmark, Share2 } from 'lucide-react';
import './VideoCard.css';

export interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadedAt: string;
  channel: { name: string; avatar: string; verified: boolean };
  category?: string;
  compact?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  id, title, thumbnail, duration, views, uploadedAt, channel, compact = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isLive = duration === 'LIVE';

  return (
    <article
      className={`video-card ${compact ? 'compact' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowMenu(false); }}
    >
      <Link to={`/watch/${id}`} className="video-card-thumb-wrap" id={`video-card-${id}`}>
        <img
          src={thumbnail}
          alt={title}
          className="video-thumb"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className={`thumb-overlay ${hovered ? 'visible' : ''}`}>
          <div className="play-btn-overlay">
            <Play size={20} fill="white" />
          </div>
        </div>

        <div className="video-duration-badge">
          {isLive ? (
            <span className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </span>
          ) : (
            <span className="duration-text">{duration}</span>
          )}
        </div>

        {/* Progress bar (simulated) */}
        {!isLive && !compact && (
          <div className="watch-progress">
            <div className="watch-progress-fill" style={{ width: `${Math.random() > 0.6 ? Math.floor(Math.random() * 80) + 10 : 0}%` }}></div>
          </div>
        )}
      </Link>

      <div className="video-card-info">
        {!compact && (
          <Link to={`/channel/${channel.name}`} className="channel-avatar-link">
            <img src={channel.avatar} alt={channel.name} className="avatar avatar-sm channel-avatar" />
          </Link>
        )}

        <div className="video-card-text">
          <Link to={`/watch/${id}`} className="video-title" title={title}>
            {title}
          </Link>
          <Link to={`/channel/${channel.name}`} className="video-channel-name">
            {channel.name}
            {channel.verified && <CheckCircle2 size={12} className="verified-icon" />}
          </Link>
          <div className="video-meta">
            <span>{views} views</span>
            <span className="meta-dot">·</span>
            <span>{uploadedAt}</span>
          </div>
        </div>

        <div className="video-card-menu">
          <button
            className="menu-trigger"
            onClick={e => { e.preventDefault(); setShowMenu(!showMenu); }}
            aria-label="More options"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="video-card-dropdown">
              <button className="dropdown-item">
                <Bookmark size={14} /> Save to playlist
              </button>
              <button className="dropdown-item">
                <Clock size={14} /> Add to Watch Later
              </button>
              <button className="dropdown-item">
                <Share2 size={14} /> Share
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
