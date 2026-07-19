import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home, Compass, History, Bookmark, ThumbsUp, Users,
  TrendingUp, Music2, Gamepad2, Plane, Tv, Settings,
  HelpCircle, LayoutDashboard, ShieldCheck, BarChart3,
  Clock, ListVideo, Film, Utensils, Palette, Dumbbell,
  Newspaper, Laugh, FlaskConical, DollarSign
} from 'lucide-react';
// TODO: Replace with real auth context
const currentUser = { avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest' };
import './Sidebar.css';

interface SidebarProps {
  open: boolean;
}

// Category items link to home with ?category= param — integrated with homepage filter
const categoryItems = [
  { category: 'Music',         icon: <Music2 size={20} />,      id: 'nav-music' },
  { category: 'Gaming',        icon: <Gamepad2 size={20} />,    id: 'nav-gaming' },
  { category: 'Travel',        icon: <Plane size={20} />,       id: 'nav-travel' },
  { category: 'Tech',          icon: <Film size={20} />,        id: 'nav-tech' },
  { category: 'Food',          icon: <Utensils size={20} />,    id: 'nav-food' },
  { category: 'Design',        icon: <Palette size={20} />,     id: 'nav-design' },
  { category: 'Sports',        icon: <Dumbbell size={20} />,    id: 'nav-sports' },
  { category: 'News',          icon: <Newspaper size={20} />,   id: 'nav-news' },
  { category: 'Comedy',        icon: <Laugh size={20} />,       id: 'nav-comedy' },
  { category: 'Science',       icon: <FlaskConical size={20} />,id: 'nav-science' },
  { category: 'Finance',       icon: <DollarSign size={20} />,  id: 'nav-finance' },
  { category: 'Entertainment', icon: <Tv size={20} />,          id: 'nav-entertainment' },
];

const navGroups = [
  {
    label: '',
    items: [
      { to: '/', icon: <Home size={20} />, label: 'Home', id: 'nav-home' },
      { to: '/explore', icon: <Compass size={20} />, label: 'Explore', id: 'nav-explore' },
      { to: '/trending', icon: <TrendingUp size={20} />, label: 'Trending', id: 'nav-trending' },
    ]
  },
  {
    label: 'Library',
    items: [
      { to: '/history', icon: <History size={20} />, label: 'History', id: 'nav-history' },
      { to: '/playlists', icon: <ListVideo size={20} />, label: 'Playlists', id: 'nav-playlists' },
      { to: '/saved', icon: <Bookmark size={20} />, label: 'Watch Later', id: 'nav-saved' },
      { to: '/liked', icon: <ThumbsUp size={20} />, label: 'Liked Videos', id: 'nav-liked' },
    ]
  },
  {
    label: 'Creator',
    items: [
      { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Studio', id: 'nav-studio' },
      { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics', id: 'nav-analytics' },
      { to: '/subscriptions', icon: <Users size={20} />, label: 'Subscriptions', id: 'nav-subs' },
    ]
  },
  {
    label: 'Admin',
    items: [
      { to: '/admin', icon: <ShieldCheck size={20} />, label: 'Admin Panel', id: 'nav-admin' },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category') || '';

  return (
    <aside className={`sidebar ${open ? 'open' : 'collapsed'}`} id="main-sidebar">
      {/* Mini avatar when collapsed */}
      {!open && (
        <div className="sidebar-mini-user">
          <img src={currentUser.avatar} alt="" className="avatar avatar-sm" />
        </div>
      )}

      <nav className="sidebar-nav">
        {/* Regular nav groups */}
        {navGroups.map((group, gi) => (
          <div key={gi} className="nav-group">
            {group.label && open && (
              <span className="nav-group-label">{group.label}</span>
            )}
            {group.items.map(item => (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                id={item.id}
                title={item.label}
              >
                <span className="nav-icon">{item.icon}</span>
                {open && <span className="nav-label">{item.label}</span>}
              </NavLink>
            ))}
            {open && <hr className="nav-divider" />}
          </div>
        ))}

        {/* Categories — integrated with homepage filter via URL param */}
        <div className="nav-group">
          {open && <span className="nav-group-label">Categories</span>}
          {categoryItems.map(item => {
            const isActive = activeCategory === item.category && location.pathname === '/';
            return (
              <Link
                key={item.id}
                to={`/?category=${item.category}`}
                className={`nav-item ${isActive ? 'active' : ''}`}
                id={item.id}
                title={item.category}
              >
                <span className="nav-icon">{item.icon}</span>
                {open && <span className="nav-label">{item.category}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {open && (
        <div className="sidebar-footer">
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} id="nav-settings">
            <span className="nav-icon"><Settings size={20} /></span>
            <span className="nav-label">Settings</span>
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} id="nav-help">
            <span className="nav-icon"><HelpCircle size={20} /></span>
            <span className="nav-label">Help</span>
          </NavLink>
          <div className="sidebar-branding">
            <p>© 2025 Streamify</p>
            <p>Made with ❤️ by Bhavya</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
