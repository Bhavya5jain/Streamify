import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, Eye, DollarSign } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import './AnalyticsPage.css';

// TODO: Replace with real analytics API data from services/api.ts
const revenueData: any[] = [];
const userGrowthData: any[] = [];


const stats = [
  { label: 'Views', value: '45.2K', change: '+12%', icon: <Eye size={20} />, color: '#06b6d4' },
  { label: 'Watch Time', value: '1.2K hrs', change: '+5%', icon: <Clock size={20} />, color: '#7c3aed' },
  { label: 'Subscribers', value: '+340', change: '+2%', icon: <Users size={20} />, color: '#22c55e' },
  { label: 'Est. Revenue', value: '$840.50', change: '+18%', icon: <DollarSign size={20} />, color: '#f59e0b' },
];

const AnalyticsPage: React.FC = () => {
  return (
    <div className="analytics-page page-container">
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">
            <BarChart3 size={28} className="icon-red" />
            Channel Analytics
          </h1>
          <p className="analytics-subtitle">Track your performance and audience growth</p>
        </div>
        <select className="input analytics-period" defaultValue="28">
          <option value="7">Last 7 days</option>
          <option value="28">Last 28 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last 365 days</option>
          <option value="lifetime">Lifetime</option>
        </select>
      </div>

      <div className="analytics-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="analytics-stat-card">
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-icon-wrap" style={{ color: stat.color, background: `${stat.color}15` }}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-body">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change positive">
                <TrendingUp size={14} /> {stat.change} vs previous 28 days
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-charts-grid">
        <div className="analytics-chart-card">
          <h2 className="chart-title">Views Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#888" tick={{fontSize: 12}} />
              <YAxis stroke="#888" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="views" stroke="#06b6d4" fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-chart-card">
          <h2 className="chart-title">Subscriber Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#888" tick={{fontSize: 12}} />
              <YAxis stroke="#888" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
              />
              <Bar dataKey="users" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
