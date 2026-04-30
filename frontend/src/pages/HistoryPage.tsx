import React from 'react';
import { History as HistoryIcon, Trash2, Search } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { mockVideos } from '../data/mockData';

const historyGroups = [
  { label: 'Today', videos: mockVideos.slice(0, 3) },
  { label: 'Yesterday', videos: mockVideos.slice(3, 6) },
  { label: 'This Week', videos: mockVideos.slice(6) },
];

const HistoryPage: React.FC = () => (
  <div className="page-container" style={{ paddingTop: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <HistoryIcon size={22} style={{ color: 'var(--accent-red)' }} />
        Watch History
      </h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-ghost" id="clear-history-btn" style={{ gap: '6px', fontSize: '13px' }}>
          <Trash2 size={14} /> Clear History
        </button>
        <button className="btn btn-secondary" id="pause-history-btn" style={{ fontSize: '13px' }}>
          Pause History
        </button>
      </div>
    </div>

    {historyGroups.map(group => (
      <div key={group.label} style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
          {group.label}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {group.videos.map(v => <VideoCard key={v.id} {...v} compact />)}
        </div>
      </div>
    ))}
  </div>
);

export default HistoryPage;
