import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Play, ChevronRight, ChevronLeft, TrendingUp, Users, CheckCircle2, Flame } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';
import { mockVideos, mockCreators, mockTweets, mockCategories } from '../data/mockData';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [heroIndex, setHeroIndex] = useState(0);
  const navigate = useNavigate();

  // Read active category from URL — synced with sidebar
  const activeCategory = searchParams.get('category') || 'All';

  const heroVideos = mockVideos.slice(0, 3);
  const featuredVideo = heroVideos[heroIndex];

  const filteredVideos = activeCategory === 'All'
    ? mockVideos
    : mockVideos.filter(v => v.category === activeCategory);

  const nextHero = () => setHeroIndex(i => (i + 1) % heroVideos.length);
  const prevHero = () => setHeroIndex(i => (i - 1 + heroVideos.length) % heroVideos.length);

  // Set category in URL (clears param for 'All')
  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-section" aria-label="Featured Video">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${featuredVideo.thumbnail})` }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badges">
            <span className="badge badge-red">
              <Flame size={12} /> Featured
            </span>
            <span className="badge badge-purple">{featuredVideo.category}</span>
          </div>
          <h1 className="hero-title">{featuredVideo.title}</h1>
          <div className="hero-meta">
            <img src={featuredVideo.channel.avatar} alt="" className="avatar avatar-sm" />
            <span className="hero-channel">{featuredVideo.channel.name}</span>
            {featuredVideo.channel.verified && <CheckCircle2 size={14} className="hero-verified" />}
            <span className="hero-views">{featuredVideo.views} views</span>
          </div>
          <div className="hero-actions">
            <Link to={`/watch/${featuredVideo.id}`} className="btn btn-primary hero-play-btn" id="hero-play-btn">
              <Play size={18} fill="white" /> Watch Now
            </Link>
            <button className="btn btn-secondary" id="hero-save-btn">+ Save</button>
          </div>
        </div>

        {/* Hero navigation */}
        <button className="hero-nav prev" onClick={prevHero} aria-label="Previous featured video">
          <ChevronLeft size={24} />
        </button>
        <button className="hero-nav next" onClick={nextHero} aria-label="Next featured video">
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="hero-dots">
          {heroVideos.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
              onClick={() => setHeroIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Categories — synced with sidebar via URL param */}
      <section className="categories-section" aria-label="Browse categories">
        <div className="h-scroll categories-scroll">
          {mockCategories.map(cat => (
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
            {mockVideos.slice(0, 6).map(video => (
              <div key={video.id} className="trending-card-wrap">
                <VideoCard {...video} />
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Grid */}
        <section className="home-section" aria-labelledby="recommended-title">
          <div className="section-header">
            <h2 className="section-title" id="recommended-title">
              <span className="section-title-accent" />
              {activeCategory !== 'All'
                ? <>{activeCategory} Videos</>
                : <>Recommended</>}
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
          {filteredVideos.length > 0 ? (
            <div className="video-grid animate-fadeInUp">
              {filteredVideos.map(video => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No videos found in <strong>{activeCategory}</strong> category.</p>
              <button className="btn btn-secondary" onClick={() => handleCategoryClick('All')}>Show all</button>
            </div>
          )}
        </section>

        {/* Two column: Creators + Tweets */}
        <div className="home-two-col">
          {/* Popular Creators */}
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
              {mockCreators.map(creator => (
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

          {/* Latest Tweets */}
          <section aria-labelledby="tweets-title">
            <div className="section-header">
              <h2 className="section-title" id="tweets-title">
                <span className="section-title-accent" />
                Latest Posts
              </h2>
            </div>
            <div className="tweets-list">
              {mockTweets.map(tweet => (
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
