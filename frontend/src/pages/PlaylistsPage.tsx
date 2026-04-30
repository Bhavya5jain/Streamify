import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListVideo, Plus, Play, MoreVertical, Pencil, Trash2, Lock, Globe, X } from 'lucide-react';
import { mockPlaylists, mockVideos } from '../data/mockData';
import './PlaylistsPage.css';

// Simulate more playlists
const allPlaylists = [
  ...mockPlaylists,
  { id: '5', name: 'Rust Programming Deep Dive', videos: 8,  thumbnail: 'https://picsum.photos/seed/pl5/320/180', updatedAt: '5 days ago', privacy: 'private' },
  { id: '6', name: 'Night Lo-Fi Sessions 🎵',   videos: 31, thumbnail: 'https://picsum.photos/seed/pl6/320/180', updatedAt: '1 week ago',  privacy: 'public' },
  { id: '7', name: 'UI/UX Inspiration',          videos: 19, thumbnail: 'https://picsum.photos/seed/pl7/320/180', updatedAt: '3 days ago',  privacy: 'public' },
  { id: '8', name: 'Cooking Masterclass',         videos: 12, thumbnail: 'https://picsum.photos/seed/pl8/320/180', updatedAt: '2 weeks ago', privacy: 'unlisted' },
].map(p => ({ ...p, privacy: (p as any).privacy || 'public' }));

interface CreateModalProps {
  onClose: () => void;
  onCreate: (name: string, privacy: string) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [privacy, setPrivacy] = useState('public');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} id="create-playlist-modal">
        <div className="modal-header">
          <h2 className="modal-title">Create New Playlist</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label htmlFor="playlist-name" className="label">Playlist Name</label>
          <input
            id="playlist-name"
            type="text"
            className="input"
            placeholder="Give your playlist a name..."
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            maxLength={60}
          />
        </div>

        <div className="form-group" style={{ marginTop: '16px' }}>
          <label className="label">Privacy</label>
          <div className="privacy-radio-group">
            {[
              { value: 'public',   icon: <Globe size={15} />,  label: 'Public',   desc: 'Anyone can see' },
              { value: 'unlisted', icon: <ListVideo size={15} />, label: 'Unlisted', desc: 'Only with link' },
              { value: 'private',  icon: <Lock size={15} />,   label: 'Private',  desc: 'Only you' },
            ].map(opt => (
              <label
                key={opt.value}
                className={`privacy-option ${privacy === opt.value ? 'selected' : ''}`}
              >
                <input type="radio" name="privacy" value={opt.value} checked={privacy === opt.value}
                  onChange={() => setPrivacy(opt.value)} style={{ display: 'none' }} />
                <span className="privacy-opt-icon">{opt.icon}</span>
                <div>
                  <div className="privacy-opt-label">{opt.label}</div>
                  <div className="privacy-opt-desc">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!name.trim()}
            onClick={() => { onCreate(name.trim(), privacy); onClose(); }}
            id="create-playlist-submit"
          >
            <Plus size={16} /> Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState(allPlaylists);
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleCreate = (name: string, privacy: string) => {
    const newPl = {
      id: Date.now().toString(),
      name,
      privacy,
      videos: 0,
      thumbnail: `https://picsum.photos/seed/${Date.now()}/320/180`,
      updatedAt: 'just now',
    };
    setPlaylists(prev => [newPl, ...prev]);
  };

  const handleDelete = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    setMenuOpen(null);
  };

  const privacyIcon = (privacy: string) => {
    if (privacy === 'private') return <Lock size={12} />;
    if (privacy === 'unlisted') return <ListVideo size={12} />;
    return <Globe size={12} />;
  };

  return (
    <div className="playlists-page page-container">
      {/* Header */}
      <div className="playlists-header">
        <div>
          <h1 className="playlists-title">
            <ListVideo size={26} className="page-icon-red" />
            Your Playlists
          </h1>
          <p className="playlists-subtitle">{playlists.length} playlists</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreate(true)}
          id="create-playlist-btn"
        >
          <Plus size={16} /> New Playlist
        </button>
      </div>

      {/* Playlist Grid */}
      <div className="playlists-grid">
        {/* Create new card */}
        <button
          className="playlist-create-card"
          onClick={() => setShowCreate(true)}
          id="playlist-create-card"
        >
          <div className="create-card-icon">
            <Plus size={32} />
          </div>
          <span className="create-card-label">Create New Playlist</span>
        </button>

        {playlists.map(playlist => (
          <div
            key={playlist.id}
            className="playlist-card-full"
            id={`playlist-${playlist.id}`}
            onMouseLeave={() => setMenuOpen(null)}
          >
            <Link to={`/playlist/${playlist.id}`} className="playlist-thumb-link">
              {/* Stacked thumbnail effect */}
              <div className="playlist-thumb-stack">
                <div className="stack-shadow stack-2" />
                <div className="stack-shadow stack-1" />
                <img
                  src={playlist.thumbnail}
                  alt={playlist.name}
                  className="playlist-thumb-img"
                  loading="lazy"
                />
                <div className="playlist-thumb-overlay">
                  <div className="playlist-play-icon">
                    <Play size={20} fill="white" />
                    <span>Play all</span>
                  </div>
                </div>
                <div className="playlist-count-badge">
                  <ListVideo size={13} />
                  {playlist.videos} videos
                </div>
              </div>
            </Link>

            <div className="playlist-card-info">
              <div className="playlist-card-meta">
                <Link to={`/playlist/${playlist.id}`} className="playlist-card-name">
                  {playlist.name}
                </Link>
                <button
                  className="playlist-menu-btn"
                  onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === playlist.id ? null : playlist.id); }}
                  aria-label="More options"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="playlist-card-footer">
                <span className="playlist-privacy">
                  {privacyIcon(playlist.privacy)} {playlist.privacy}
                </span>
                <span className="playlist-updated">Updated {playlist.updatedAt}</span>
              </div>

              {/* Context Menu */}
              {menuOpen === playlist.id && (
                <div className="dropdown playlist-dropdown">
                  <button className="dropdown-item" id={`edit-playlist-${playlist.id}`}>
                    <Pencil size={14} /> Rename
                  </button>
                  <button
                    className="dropdown-item danger"
                    onClick={() => handleDelete(playlist.id)}
                    id={`delete-playlist-${playlist.id}`}
                  >
                    <Trash2 size={14} /> Delete playlist
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
    </div>
  );
};

export default PlaylistsPage;
