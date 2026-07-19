import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const SIDEBAR_KEY = 'streamify_sidebar';

// Routes that don't require login and have no nav/sidebar
const AUTH_ROUTES = ['/login', '/register'];

// Routes that require the user to be logged in
const PROTECTED_PATHS = [
  '/upload', '/dashboard', '/analytics', '/admin',
  '/history', '/playlists', '/saved', '/liked',
  '/subscriptions', '/profile', '/notifications', '/settings',
];

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    return stored !== null ? stored === 'true' : window.innerWidth >= 1024;
  });

  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [location.pathname]);

  const handleOverlayClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const protect = (element: React.ReactNode) => (
    <ProtectedRoute>{element}</ProtectedRoute>
  );

  return (
    <div className="app-layout">
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      ) : (
        <>
          <Navbar
            onMenuClick={() => setSidebarOpen(prev => !prev)}
            sidebarOpen={sidebarOpen}
          />

          <Sidebar open={sidebarOpen} />

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

          <main
            className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}
            id="main-content"
          >
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/search" element={<ExplorePage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/watch/:id" element={<WatchPage />} />

              {/* Protected routes — redirect to /login if not authenticated */}
              <Route path="/upload"        element={protect(<UploadPage />)} />
              <Route path="/dashboard"     element={protect(<DashboardPage />)} />
              <Route path="/analytics"     element={protect(<AnalyticsPage />)} />
              <Route path="/admin"         element={protect(<AdminPage />)} />
              <Route path="/history"       element={protect(<HistoryPage />)} />
              <Route path="/playlists"     element={protect(<PlaylistsPage />)} />
              <Route path="/saved"         element={protect(<WatchLaterPage />)} />
              <Route path="/liked"         element={protect(<LikedVideosPage />)} />
              <Route path="/subscriptions" element={protect(<SubscriptionsPage />)} />
              <Route path="/profile"       element={protect(<ProfilePage />)} />
              <Route path="/notifications" element={protect(<NotificationsPage />)} />
              <Route path="/settings"      element={protect(<SettingsPage />)} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <MobileNav />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
