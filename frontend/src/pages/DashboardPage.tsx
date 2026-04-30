import React, { useState } from 'react';
import {
  LayoutDashboard, Video, BarChart3, DollarSign,
  TrendingUp, Eye, ThumbsUp, Clock, Plus
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { mockVideos, mockRevenueData } from '../data/mockData';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const quickStats = [
  { label: 'Total Views', value: '2.1M', icon: <Eye size={20} />, color: '#06b6d4', change: '+18%' },
  { label: 'Subscribers', value: '12.4K', icon: <TrendingUp size={20} />, color: '#22c55e', change: '+247' },
  { label: 'Watch Time', value: '48.2K hrs', icon: <Clock size={20} />, color: '#7c3aed', change: '+12%' },
  { label: 'Revenue', value: '$2,847', icon: <DollarSign size={20} />, color: '#f59e0b', change: '+$340' },
];

const DashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'content' | 'analytics' | 'revenue'>('overview');

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
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-change positive">
              <TrendingUp size={12} /> {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      {(activeSection === 'overview' || activeSection === 'analytics' || activeSection === 'revenue') && (
        <>
          {/* Performance Chart */}
          <div className="dashboard-card" id="performance-chart">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-title-accent" />
                {activeSection === 'revenue' ? 'Revenue Performance' : 'Views & Engagement'}
              </h2>
              <select className="input" style={{ width: 'auto', fontSize: '13px', padding: '6px 12px' }}>
                <option>Last 28 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={mockRevenueData}>
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
                <Area type="monotone" dataKey={activeSection === 'revenue' ? 'revenue' : 'views'} stroke="#ff0040" fill="url(#dashGrad1)" strokeWidth={2} name={activeSection === 'revenue' ? 'Revenue' : 'Views'} />
                {activeSection === 'overview' && (
                  <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#dashGrad2)" strokeWidth={2} name="Revenue" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Content Management */}
      {(activeSection === 'overview' || activeSection === 'content') && (
        <div className="dashboard-card" id="content-management">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-title-accent" />
              Your Videos
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="input" style={{ width: 'auto', fontSize: '13px', padding: '6px 12px' }}>
                <option>All videos</option>
                <option>Published</option>
                <option>Drafts</option>
              </select>
            </div>
          </div>
          <div className="content-table-wrap">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockVideos.map(video => (
                  <tr key={video.id} id={`content-row-${video.id}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={video.thumbnail}
                          alt=""
                          style={{ width: 80, aspectRatio: '16/9', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {video.title}
                        </span>
                      </div>
                    </td>
                    <td><span className="badge badge-green">Published</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{video.views}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ThumbsUp size={13} /> {Math.floor(Math.random() * 50 + 1)}K
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>{video.uploadedAt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/watch/${video.id}`} className="btn-icon" style={{ width: 28, height: 28 }} title="View">
                          <Eye size={13} />
                        </Link>
                        <Link to="/upload" className="btn-icon" style={{ width: 28, height: 28 }} title="Edit">
                          ✏️
                        </Link>
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
