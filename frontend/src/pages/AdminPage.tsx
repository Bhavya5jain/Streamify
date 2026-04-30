import React, { useState } from 'react';
import {
  Users, Video, Eye, DollarSign, Flag, Shield,
  TrendingUp, TrendingDown, CheckCircle, X, AlertTriangle,
  MoreHorizontal, Download, Filter, Search
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import {
  mockRevenueData, mockUserGrowthData, mockFlaggedContent, mockCreators
} from '../data/mockData';
import './AdminPage.css';

const adminStats = [
  {
    label: 'Total Users',
    value: '2.84M',
    change: '+12.4%',
    positive: true,
    icon: <Users size={22} />,
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.12)',
  },
  {
    label: 'Total Videos',
    value: '487K',
    change: '+8.2%',
    positive: true,
    icon: <Video size={22} />,
    color: '#ff0040',
    bg: 'rgba(255, 0, 64, 0.12)',
  },
  {
    label: 'Total Views',
    value: '1.2B',
    change: '+23.1%',
    positive: true,
    icon: <Eye size={22} />,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.12)',
  },
  {
    label: 'Revenue',
    value: '$148.4K',
    change: '+18.7%',
    positive: true,
    icon: <DollarSign size={22} />,
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
  },
  {
    label: 'Reports',
    value: '1,247',
    change: '+34 today',
    positive: false,
    icon: <Flag size={22} />,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
  {
    label: 'Flagged Content',
    value: '89',
    change: 'Needs review',
    positive: false,
    icon: <Shield size={22} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
  },
];

const recentUploads = [
  { title: 'React 19 New Features', channel: 'CodeWithAlex', views: '24K', status: 'live', time: '2h ago' },
  { title: 'Tokyo Night Walk 4K', channel: 'NomadLens', views: '8.9K', status: 'live', time: '4h ago' },
  { title: 'Figma Tutorial 2025', channel: 'DesignStudio', views: '12.3K', status: 'processing', time: '6h ago' },
  { title: 'Rust vs Go in 2025', channel: 'TechReviewPro', views: '45K', status: 'live', time: '8h ago' },
  { title: 'Lofi Study Mix', channel: 'ChillWaves', views: '2.1K', status: 'draft', time: '10h ago' },
];

const severityColors: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#06b6d4',
  low: '#22c55e',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name?.includes('revenue')
              ? `$${entry.value.toLocaleString()}`
              : entry.value.toLocaleString()
            }
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminPage: React.FC = () => {
  const [flagFilter, setFlagFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlagged = mockFlaggedContent.filter(item => {
    const matchesSeverity = flagFilter === 'all' || item.severity === flagFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      || item.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="admin-page page-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Platform analytics & content moderation</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn btn-secondary" id="export-btn">
            <Download size={16} /> Export Report
          </button>
          <button className="btn btn-primary" id="admin-refresh-btn">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="admin-stats-grid" aria-label="Platform statistics">
        {adminStats.map((stat, i) => (
          <div key={i} className="stat-card" id={`stat-card-${stat.label.toLowerCase().replace(/\s/g, '-')}`}>
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {stat.change}
            </div>
          </div>
        ))}
      </section>

      {/* Charts */}
      <div className="admin-charts">
        {/* Revenue Chart */}
        <section className="admin-chart-card" aria-labelledby="revenue-chart-title">
          <div className="section-header">
            <h2 className="section-title" id="revenue-chart-title">
              <span className="section-title-accent" />
              Revenue & Views
            </h2>
            <select className="input chart-period-select" style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}>
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockRevenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff0040" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff0040" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#888' }} />
                <Area type="monotone" dataKey="revenue" stroke="#ff0040" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue ($)" />
                <Area type="monotone" dataKey="views" stroke="#7c3aed" fill="url(#viewsGrad)" strokeWidth={2} name="Views" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* User Growth Chart */}
        <section className="admin-chart-card" aria-labelledby="growth-chart-title">
          <div className="section-header">
            <h2 className="section-title" id="growth-chart-title">
              <span className="section-title-accent" />
              User Growth
            </h2>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mockUserGrowthData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#ff0040" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="users" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Bottom 3-col layout */}
      <div className="admin-bottom-grid">
        {/* Top Creators */}
        <section className="admin-card" aria-labelledby="top-creators-title">
          <h2 className="admin-card-title" id="top-creators-title">Top Creators</h2>
          <div className="top-creators-list">
            {mockCreators.map((creator, i) => (
              <div key={creator.id} className="top-creator-row" id={`top-creator-${creator.id}`}>
                <span className="top-rank">#{i + 1}</span>
                <img src={creator.avatar} alt={creator.name} className="avatar avatar-sm" />
                <div className="top-creator-info">
                  <span className="top-creator-name">{creator.name}</span>
                  <span className="top-creator-subs">{creator.subscribers}</span>
                </div>
                <span className="badge badge-purple top-creator-badge">{creator.category}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Uploads */}
        <section className="admin-card" aria-labelledby="recent-uploads-title">
          <h2 className="admin-card-title" id="recent-uploads-title">Recent Uploads</h2>
          <div className="recent-uploads-list">
            {recentUploads.map((upload, i) => (
              <div key={i} className="recent-upload-row">
                <div className="upload-info">
                  <span className="upload-title">{upload.title}</span>
                  <span className="upload-meta">{upload.channel} · {upload.time}</span>
                </div>
                <div className="upload-stats">
                  <span className="upload-views">{upload.views}</span>
                  <span className={`badge ${
                    upload.status === 'live' ? 'badge-green' :
                    upload.status === 'processing' ? 'badge-yellow' : 'badge-purple'
                  }`}>
                    {upload.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="admin-card" aria-labelledby="quick-actions-title">
          <h2 className="admin-card-title" id="quick-actions-title">Quick Actions</h2>
          <div className="quick-actions">
            {[
              { label: 'Review flagged content', color: '#ef4444', count: 89 },
              { label: 'Approve pending creators', color: '#22c55e', count: 12 },
              { label: 'Process withdrawals', color: '#7c3aed', count: 7 },
              { label: 'Handle appeals', color: '#f59e0b', count: 24 },
              { label: 'Update featured videos', color: '#06b6d4', count: null },
            ].map((action, i) => (
              <button key={i} className="quick-action-btn" id={`quick-action-${i}`}>
                <span className="quick-action-dot" style={{ background: action.color }} />
                <span className="quick-action-label">{action.label}</span>
                {action.count !== null && (
                  <span className="quick-action-count" style={{ background: action.color + '22', color: action.color }}>
                    {action.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Moderation Table */}
      <section className="admin-card moderation-section" id="moderation-table" aria-labelledby="moderation-title">
        <div className="section-header">
          <h2 className="admin-card-title" id="moderation-title" style={{ marginBottom: 0 }}>
            Content Moderation
          </h2>
          <div className="moderation-filters">
            <div className="search-input-wrap" style={{ width: '220px', height: '38px' }}>
              <Search size={14} className="search-icon" />
              <input
                type="search"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                id="moderation-search"
              />
            </div>
            <select
              className="input"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
              value={flagFilter}
              onChange={e => setFlagFilter(e.target.value)}
              id="severity-filter"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="moderation-table-wrap">
          <table className="moderation-table" role="table">
            <thead>
              <tr>
                <th>Content</th>
                <th>Channel</th>
                <th>Reports</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlagged.map(item => (
                <tr key={item.id} id={`moderation-row-${item.id}`}>
                  <td className="mod-title">{item.title}</td>
                  <td className="mod-channel">@{item.channel}</td>
                  <td className="mod-reports">
                    <span className="reports-count">{item.reports}</span>
                  </td>
                  <td>
                    <span
                      className="severity-badge"
                      style={{
                        background: severityColors[item.severity] + '20',
                        color: severityColors[item.severity],
                        border: `1px solid ${severityColors[item.severity]}40`,
                      }}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      item.status === 'pending' ? 'badge-yellow' :
                      item.status === 'reviewed' ? 'badge-purple' : 'badge-red'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="mod-time">{item.time}</td>
                  <td>
                    <div className="mod-actions">
                      <button
                        className="mod-action-btn approve"
                        aria-label="Approve"
                        title="Approve"
                      >
                        <CheckCircle size={15} />
                      </button>
                      <button
                        className="mod-action-btn remove"
                        aria-label="Remove"
                        title="Remove"
                      >
                        <X size={15} />
                      </button>
                      <button
                        className="mod-action-btn warn"
                        aria-label="Warn"
                        title="Warn"
                      >
                        <AlertTriangle size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFlagged.length === 0 && (
            <div className="table-empty">No flagged content matching your filters.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
