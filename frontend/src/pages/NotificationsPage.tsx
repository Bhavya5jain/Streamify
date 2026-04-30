import React, { useState } from 'react';
import { Bell, CheckCheck, Settings } from 'lucide-react';
import { mockNotifications } from '../data/mockData';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div className="page-container" style={{ paddingTop: '24px', maxWidth: '700px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={22} style={{ color: 'var(--accent-red)' }} />
          Notifications
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={markAllRead} id="mark-all-read-btn" style={{ fontSize: '13px', gap: '6px' }}>
            <CheckCheck size={14} /> Mark all read
          </button>
          <button className="btn-icon" id="notif-settings-btn" aria-label="Notification settings">
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.map(notif => (
          <div
            key={notif.id}
            id={`notif-page-${notif.id}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              padding: '16px',
              background: notif.read ? 'var(--bg-glass)' : 'rgba(255,0,64,0.04)',
              border: `1px solid ${notif.read ? 'var(--border-subtle)' : 'rgba(255,0,64,0.1)'}`,
              borderRadius: 'var(--radius-lg)',
              transition: 'var(--transition)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = notif.read ? 'var(--bg-glass)' : 'rgba(255,0,64,0.04)')}
          >
            <img src={notif.avatar} alt={notif.user} className="avatar avatar-md" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text-primary)' }}>{notif.user}</strong>{' '}
                {notif.message}
                {notif.title && <em style={{ color: 'var(--accent-red)', fontStyle: 'normal' }}> "{notif.title}"</em>}
              </p>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{notif.time}</span>
            </div>
            {!notif.read && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', flexShrink: 0, marginTop: '6px' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
