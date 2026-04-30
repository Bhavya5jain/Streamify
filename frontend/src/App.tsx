import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ExplorePage from './pages/ExplorePage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import DashboardPage from './pages/DashboardPage';
import PlaylistsPage from './pages/PlaylistsPage';
import WatchLaterPage from './pages/WatchLaterPage';
import LikedVideosPage from './pages/LikedVideosPage';
import TrendingPage from './pages/TrendingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

const SIDEBAR_KEY = 'streamify_sidebar';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    return stored !== null ? stored === 'true' : window.innerWidth >= 1024;
  });

  const location = useLocation();
  const isWatchPage = location.pathname.startsWith('/watch/');

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Mobile overlay click to close
  const handleOverlayClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar
        onMenuClick={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
      />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="sidebar-overlay"
          onClick={handleOverlayClick}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 390,
          }}
        />
      )}

      {/* Main content */}
      <main
        className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}
        id="main-content"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/saved" element={<WatchLaterPage />} />
          <Route path="/liked" element={<LikedVideosPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/search" element={<ExplorePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
