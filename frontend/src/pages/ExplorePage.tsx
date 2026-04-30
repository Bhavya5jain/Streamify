import React, { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { mockVideos, mockCategories, mockCreators } from '../data/mockData';
import './ExplorePage.css';

const ExplorePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockVideos.filter(v => {
    const matchCat = activeCategory === 'All' || v.category === activeCategory;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.channel.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-container explore-page">
      <div className="explore-header">
        <h1 className="explore-title">
          <TrendingUp size={24} className="explore-icon" />
          Explore & Search
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
        </div>
      </div>

      <div className="h-scroll categories-scroll" style={{ marginBottom: '24px' }}>
        {mockCategories.map(cat => (
          <button
            key={cat}
            className={`tag ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            id={`explore-cat-${cat.toLowerCase()}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="section-header" style={{ marginBottom: '16px' }}>
        <h2 className="section-title">
          <span className="section-title-accent" />
          {search ? `Results for "${search}"` : activeCategory === 'All' ? 'All Videos' : activeCategory}
        </h2>
        <span className="section-link">{filtered.length} videos</span>
      </div>

      {filtered.length > 0 ? (
        <div className="video-grid animate-fadeInUp">
          {filtered.map(v => <VideoCard key={v.id} {...v} />)}
        </div>
      ) : (
        <div className="explore-empty">
          <Search size={40} />
          <h3>No results found</h3>
          <p>Try a different search term or category</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
