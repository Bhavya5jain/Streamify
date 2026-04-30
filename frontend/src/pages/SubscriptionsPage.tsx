import React, { useState } from 'react';
import { Users, Bell, Search, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCreators } from '../data/mockData';
import './SubscriptionsPage.css';

const SubscriptionsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredCreators = mockCreators.filter(creator => 
    creator.name.toLowerCase().includes(search.toLowerCase()) || 
    creator.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="subscriptions-page page-container">
      <div className="subscriptions-header">
        <div>
          <h1 className="subscriptions-title">
            <Users size={28} className="icon-red" />
            Subscriptions
          </h1>
          <p className="subscriptions-subtitle">Manage your favorite creators</p>
        </div>
        <div className="search-input-wrap subs-search">
          <Search size={16} className="search-icon" />
          <input 
            type="search" 
            className="search-input" 
            placeholder="Search channels..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="subs-list">
        {filteredCreators.length > 0 ? (
          filteredCreators.map(creator => (
            <div key={creator.id} className="sub-card">
              <img src={creator.avatar} alt={creator.name} className="sub-avatar" />
              <div className="sub-info">
                <Link to={`/channel/${creator.name}`} className="sub-name">
                  {creator.name}
                  {creator.verified && <CheckCircle2 size={14} className="verified-icon" />}
                </Link>
                <div className="sub-meta">
                  <span>{creator.subscribers} subscribers</span>
                  <span className="meta-dot">·</span>
                  <span>{creator.videos} videos</span>
                </div>
                <div className="sub-desc">
                  Providing the best {creator.category.toLowerCase()} content for you to enjoy.
                </div>
              </div>
              <div className="sub-actions">
                <button className="btn btn-ghost notif-btn" title="Notifications">
                  <Bell size={18} />
                </button>
                <button className="btn btn-secondary sub-btn">Subscribed</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No channels found</h3>
            <p>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
