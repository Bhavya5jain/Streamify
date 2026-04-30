import React, { useState } from 'react';
import { Flame, TrendingUp, Music2, Gamepad2, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { mockVideos } from '../data/mockData';
import './TrendingPage.css';

// Simulate trending categories
const trendingCategories = [
  { id: 'now', label: 'Now', icon: <TrendingUp size={16} /> },
  { id: 'music', label: 'Music', icon: <Music2 size={16} /> },
  { id: 'gaming', label: 'Gaming', icon: <Gamepad2 size={16} /> },
  { id: 'movies', label: 'Movies', icon: <Film size={16} /> },
];

const TrendingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('now');

  // Sort mock videos by views for the trending effect
  // In a real app, backend would return the trending list
  const trendingVideos = [...mockVideos].sort((a, b) => {
    // Basic string parse for mock views like "2.4M", "890K"
    const parseViews = (v: string) => {
      if (v.includes('M')) return parseFloat(v) * 1000000;
      if (v.includes('K')) return parseFloat(v) * 1000;
      return parseFloat(v);
    };
    return parseViews(b.views) - parseViews(a.views);
  });

  return (
    <div className="trending-page page-container">
      {/* Header */}
      <div className="trending-header">
        <div className="trending-icon-wrap">
          <Flame size={32} fill="currentColor" />
        </div>
        <div>
          <h1 className="trending-title">Trending</h1>
          <p className="trending-subtitle">What's popular right now</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="trending-tabs">
        {trendingCategories.map(tab => (
          <button
            key={tab.id}
            className={`trending-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            id={`trending-tab-${tab.id}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Video List */}
      <div className="trending-list animate-fadeInUp">
        {trendingVideos.map((video, index) => (
          <div key={video.id} className="trending-list-item" id={`trending-item-${video.id}`}>
            <div className="trending-rank">#{index + 1}</div>
            
            <Link to={`/watch/${video.id}`} className="trending-thumb-wrap">
              <img src={video.thumbnail} alt={video.title} className="trending-thumb" />
              <div className="trending-duration">{video.duration}</div>
            </Link>

            <div className="trending-info">
              <Link to={`/watch/${video.id}`} className="trending-video-title">
                {video.title}
              </Link>
              <div className="trending-meta">
                <Link to={`/channel/${video.channel.name}`} className="trending-channel">
                  <img src={video.channel.avatar} alt="" className="avatar avatar-sm" />
                  {video.channel.name}
                </Link>
                <span className="meta-dot">·</span>
                <span>{video.views} views</span>
                <span className="meta-dot">·</span>
                <span>{video.uploadedAt}</span>
              </div>
              <p className="trending-desc">
                This is a trending video on Streamify. Watch it now to see why everyone is talking about it. 
                Don't forget to like and subscribe!
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
