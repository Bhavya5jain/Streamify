import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Play, ChevronRight, ChevronLeft, TrendingUp, Users, CheckCircle2, Flame, VideoOff, Loader2 } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';
import { getVideos } from '../services/api';
import './HomePage.css';

// Format seconds → "m:ss"
const formatDuration = (secs: number): string => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Format ISO date → "X days ago" etc.
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

// Derive a thumbnail from a Cloudinary video URL if no thumbnail was uploaded.
const getVideoThumbnail = (thumbnail: string, videoFile: string): string => {
  if (thumbnail) return thumbnail;
  if (!videoFile || !videoFile.includes('cloudinary.com')) {
    return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  }
  // Extract cloud name and public_id
  const match = videoFile.match(/cloudinary\.com\/([^/]+)\/(?:video|image)\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  if (!match) return 'https://placehold.co/320x180/1a1a2e/ffffff?text=No+Thumbnail';
  const [, cloudName, publicId] = match;

  // If stored as video → use so_30p to grab a frame
  if (videoFile.includes('/video/upload/')) {
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_30p,w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
  }
  // If stored as image (resource_type:auto bug on old uploads) → just resize it
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
};

// Map raw API video → VideoCard props
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

const creators: any[] = [];
const tweets: any[] = [];
const categories = ['All', 'Tech', 'Music', 'Gaming', 'Travel', 'Food', 'Design', 'Sports', 'News', 'Comedy', 'Science', 'Finance'];

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [heroIndex, setHeroIndex] = useState(0);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const activeCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params: any = { limit: 20, sortBy: 'createdAt', sortType: 'desc' };
        if (activeCategory !== 'All') params.category = activeCategory;
        const res = await getVideos(params);
        const docs = res?.data?.docs ?? res?.data ?? [];
        setVideos(Array.isArray(docs) ? docs : []);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [activeCategory]); // re-fetch when category changes

  const heroVideos = videos.slice(0, 3);
  const featuredVideo = heroVideos[heroIndex];

  const nextHero = () => setHeroIndex(i => (i + 1) % heroVideos.length);
  const prevHero = () => setHeroIndex(i => (i - 1 + heroVideos.length) % heroVideos.length);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Banner — only shown when videos are available */}
      {featuredVideo && (
        <section className="hero-section" aria-label="Featured Video">
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${getVideoThumbnail(featuredVideo.thumbnail, featuredVideo.videoFile)})` }}
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-badges">
              <span className="badge badge-red">
                <Flame size={12} /> Featured
              </span>
            </div>
            <h1 className="hero-title">{featuredVideo.title}</h1>
            <div className="hero-meta">
              <img
                src={featuredVideo.owner?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${featuredVideo.owner?.username}`}
                alt=""
                className="avatar avatar-sm"
              />
              <span className="hero-channel">{featuredVideo.owner?.fullName || featuredVideo.owner?.username}</span>
              <span className="hero-views">{featuredVideo.views?.toLocaleString()} views</span>
            </div>
            <div className="hero-actions">
              <Link to={`/watch/${featuredVideo._id}`} className="btn btn-primary hero-play-btn" id="hero-play-btn">
                <Play size={18} fill="white" /> Watch Now
              </Link>
            </div>
          </div>
          <button className="hero-nav prev" onClick={prevHero} aria-label="Previous">
            <ChevronLeft size={24} />
          </button>
          <button className="hero-nav next" onClick={nextHero} aria-label="Next">
            <ChevronRight size={24} />
          </button>
          <div className="hero-dots">
            {heroVideos.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
                onClick={() => setHeroIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="categories-section" aria-label="Browse categories">
        <div className="h-scroll categories-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              className={`tag ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
              id={`category-${cat.toLowerCase()}`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="page-container">
        {/* Trending Videos */}
        <section className="home-section animate-fadeInUp" aria-labelledby="trending-title">
          <div className="section-header">
            <h2 className="section-title" id="trending-title">
              <span className="section-title-accent" />
              <TrendingUp size={20} className="section-icon-red" />
              Trending Now
            </h2>
            <Link to="/trending" className="section-link">See all <ChevronRight size={14} /></Link>
          </div>
          <div className="h-scroll trending-scroll">
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', padding: '16px' }}>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
              </div>
            ) : (
              videos.slice(0, 6).map((video: any) => (
                <div key={video._id} className="trending-card-wrap">
                  <VideoCard {...toCardProps(video)} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recommended Grid */}
        <section className="home-section" aria-labelledby="recommended-title">
          <div className="section-header">
            <h2 className="section-title" id="recommended-title">
              <span className="section-title-accent" />
              {activeCategory !== 'All' ? <>{activeCategory} Videos</> : <>Recommended</>}
            </h2>
            {activeCategory !== 'All' && (
              <button
                className="section-link"
                onClick={() => handleCategoryClick('All')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Clear filter ✕
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : videos.length === 0 ? (
            <div className="no-results">
              <VideoOff size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p style={{ color: 'var(--text-muted)' }}>No videos yet. Be the first to upload!</p>
            </div>
          ) : videos.length > 0 ? (
            <div className="video-grid animate-fadeInUp">
              {videos.map((video: any) => (
                <VideoCard key={video._id} {...toCardProps(video)} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No videos in <strong>{activeCategory}</strong>.</p>
              <button className="btn btn-secondary" onClick={() => handleCategoryClick('All')}>Show all</button>
            </div>
          )}
        </section>

        {/* Two column: Creators + Tweets */}
        <div className="home-two-col">
          <section aria-labelledby="creators-title">
            <div className="section-header">
              <h2 className="section-title" id="creators-title">
                <span className="section-title-accent" />
                <Users size={18} />
                Top Creators
              </h2>
              <Link to="/explore" className="section-link">View all</Link>
            </div>
            <div className="creators-list">
              {creators.map(creator => (
                <Link
                  key={creator.id}
                  to={`/channel/${creator.name}`}
                  className="creator-card glass-card"
                  id={`creator-card-${creator.id}`}
                >
                  <div className="creator-rank">#{creator.id}</div>
                  <img src={creator.avatar} alt={creator.name} className="avatar avatar-lg" />
                  <div className="creator-info">
                    <div className="creator-name">
                      {creator.name}
                      {creator.verified && <CheckCircle2 size={13} className="verified-icon" />}
                    </div>
                    <div className="creator-handle">{creator.handle}</div>
                    <div className="creator-stats">
                      <span>{creator.subscribers} subscribers</span>
                      <span className="meta-dot">·</span>
                      <span>{creator.videos} videos</span>
                    </div>
                  </div>
                  <button className="btn btn-secondary creator-sub-btn">Subscribe</button>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="tweets-title">
            <div className="section-header">
              <h2 className="section-title" id="tweets-title">
                <span className="section-title-accent" />
                Latest Posts
              </h2>
            </div>
            <div className="tweets-list">
              {tweets.map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner page-container">
          <div className="footer-brand">
            <div className="footer-logo gradient-text">Streamify</div>
            <p className="footer-tagline">The premium video streaming platform for creators and viewers alike.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/explore">Explore</Link>
              <Link to="/trending">Trending</Link>
              <Link to="/upload">Upload</Link>
            </div>
            <div className="footer-col">
              <h4>Creator</h4>
              <Link to="/dashboard">Creator Studio</Link>
              <Link to="/analytics">Analytics</Link>
              <Link to="/admin">Admin Panel</Link>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <Link to="/history">Watch History</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Streamify · Made with ❤️ by Bhavya Jain</span>
          <div className="footer-legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
