import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Upload, Bell, User } from 'lucide-react';
import './MobileNav.css';

const MobileNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: <Home size={22} />, label: 'Home', id: 'mobile-nav-home' },
    { to: '/explore', icon: <Search size={22} />, label: 'Explore', id: 'mobile-nav-explore' },
    { to: '/upload', icon: <Upload size={22} />, label: 'Upload', id: 'mobile-nav-upload', isPrimary: true },
    { to: '/notifications', icon: <Bell size={22} />, label: 'Alerts', id: 'mobile-nav-alerts' },
    { to: '/profile', icon: <User size={22} />, label: 'Profile', id: 'mobile-nav-profile' },
  ];

  return (
    <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
      {navItems.map(item => (
        <NavLink
          key={item.id}
          to={item.to}
          end={item.to === '/'}
          id={item.id}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''} ${item.isPrimary ? 'primary' : ''}`
          }
        >
          <div className={`mobile-nav-icon ${item.isPrimary ? 'primary-icon' : ''}`}>
            {item.icon}
          </div>
          <span className="mobile-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
