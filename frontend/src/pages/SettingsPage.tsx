import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Monitor, Shield } from 'lucide-react';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="settings-page page-container">
      <div className="settings-header">
        <h1 className="settings-title">
          <SettingsIcon size={28} className="icon-red" />
          Settings
        </h1>
      </div>

      <div className="settings-layout">
        {/* Sidebar Nav for Settings */}
        <div className="settings-nav">
          <button className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
            <User size={18} /> Account
          </button>
          <button className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <Bell size={18} /> Notifications
          </button>
          <button className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
            <Lock size={18} /> Privacy
          </button>
          <button className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
            <Monitor size={18} /> Appearance
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'account' && (
            <div className="settings-section animate-fadeInUp">
              <h2>Account Settings</h2>
              <p className="settings-desc">Manage your account details and preferences.</p>
              
              <div className="settings-form">
                <div className="form-group">
                  <label className="label">Email Address</label>
                  <input type="email" className="input" defaultValue="user@streamify.com" />
                </div>
                <div className="form-group">
                  <label className="label">Phone Number</label>
                  <input type="text" className="input" defaultValue="+1 234 567 8900" />
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>

              <hr className="settings-divider" />
              
              <div className="settings-danger">
                <h3>Delete Account</h3>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="btn btn-ghost danger-btn">Delete Account</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section animate-fadeInUp">
              <h2>Notifications</h2>
              <p className="settings-desc">Choose what notifications you want to receive.</p>

              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your channel via email.</p>
                  </div>
                  <input type="checkbox" className="toggle-switch" defaultChecked />
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Push Notifications</h4>
                    <p>Get notified when someone comments on your videos.</p>
                  </div>
                  <input type="checkbox" className="toggle-switch" defaultChecked />
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Creator Updates</h4>
                    <p>Announcements and tips for creators.</p>
                  </div>
                  <input type="checkbox" className="toggle-switch" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section animate-fadeInUp">
              <h2>Privacy</h2>
              <p className="settings-desc">Manage who can see your content and activity.</p>
              
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Keep all my saved playlists private</h4>
                  </div>
                  <input type="checkbox" className="toggle-switch" defaultChecked />
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Keep all my subscriptions private</h4>
                  </div>
                  <input type="checkbox" className="toggle-switch" defaultChecked />
                </div>
              </div>

              <div className="security-panel">
                <Shield size={24} className="icon-purple" />
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account.</p>
                </div>
                <button className="btn btn-secondary">Enable</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section animate-fadeInUp">
              <h2>Appearance</h2>
              <p className="settings-desc">Customize how Streamify looks.</p>
              
              <div className="theme-options">
                <label className="theme-option active">
                  <div className="theme-preview dark"></div>
                  <span>Dark Mode (Default)</span>
                </label>
                <label className="theme-option disabled">
                  <div className="theme-preview light"></div>
                  <span>Light Mode (Coming Soon)</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
