import React, { useState } from 'react';
import { Clock, Trash2, Play, Shuffle, X, CheckSquare } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { mockVideos } from '../data/mockData';
import './WatchLaterPage.css';

// Simulate watch later list with added time info
const initialWatchLater = mockVideos.map((v, i) => ({
  ...v,
  addedAt: ['2 hours ago', 'Yesterday', '3 days ago', '1 week ago', '2 weeks ago'][i % 5],
}));

const WatchLaterPage: React.FC = () => {
  const [videos, setVideos] = useState(initialWatchLater);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  const totalDuration = `${Math.floor(videos.length * 22)} min`;

  const removeVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const removeSelected = () => {
    setVideos(prev => prev.filter(v => !selected.has(v.id)));
    setSelected(new Set());
    setSelectMode(false);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === videos.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(videos.map(v => v.id)));
    }
  };

  const clearAll = () => {
    setVideos([]);
    setSelected(new Set());
    setSelectMode(false);
  };

  return (
    <div className="watch-later-page page-container">
      {/* Header */}
      <div className="wl-header">
        <div className="wl-header-left">
          <div className="wl-icon-wrap">
            <Clock size={28} />
          </div>
          <div>
            <h1 className="wl-title">Watch Later</h1>
            <p className="wl-subtitle">
              {videos.length} videos · ~{totalDuration} total
            </p>
          </div>
        </div>

        <div className="wl-header-actions">
          {videos.length > 0 && (
            <>
              {!selectMode ? (
                <>
                  <button className="btn btn-primary wl-play-all" id="play-all-btn">
                    <Play size={16} fill="white" /> Play All
                  </button>
                  <button className="btn btn-secondary" id="shuffle-btn">
                    <Shuffle size={16} /> Shuffle
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setSelectMode(true)}
                    id="select-mode-btn"
                  >
                    <CheckSquare size={16} /> Select
                  </button>
                  <button className="btn btn-ghost danger-btn" onClick={clearAll} id="clear-all-btn">
                    <Trash2 size={16} /> Clear All
                  </button>
                </>
              ) : (
                <>
                  <span className="selected-count">{selected.size} selected</span>
                  <button className="btn btn-secondary" onClick={toggleAll} id="select-all-btn">
                    {selected.size === videos.length ? 'Deselect All' : 'Select All'}
                  </button>
                  {selected.size > 0 && (
                    <button className="btn btn-ghost danger-btn" onClick={removeSelected} id="remove-selected-btn">
                      <Trash2 size={16} /> Remove ({selected.size})
                    </button>
                  )}
                  <button className="btn btn-ghost" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>
                    Cancel
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {videos.length === 0 ? (
        <div className="wl-empty">
          <div className="wl-empty-icon">
            <Clock size={48} />
          </div>
          <h2>Your Watch Later is empty</h2>
          <p>Save videos to watch when you have time. Click the <strong>Save</strong> button on any video.</p>
        </div>
      ) : (
        <div className="wl-list">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className={`wl-item ${selectMode && selected.has(video.id) ? 'selected' : ''}`}
              id={`wl-item-${video.id}`}
            >
              {/* Select checkbox */}
              {selectMode && (
                <button
                  className={`wl-checkbox ${selected.has(video.id) ? 'checked' : ''}`}
                  onClick={() => toggleSelect(video.id)}
                  aria-label={`Select ${video.title}`}
                >
                  {selected.has(video.id) ? '✓' : ''}
                </button>
              )}

              {/* Position number */}
              <span className="wl-index">{index + 1}</span>

              {/* Video card in compact mode */}
              <div className="wl-video-wrap">
                <VideoCard {...video} compact />
              </div>

              {/* Added time */}
              <span className="wl-added-time">Added {video.addedAt}</span>

              {/* Remove button */}
              <button
                className="wl-remove-btn"
                onClick={() => removeVideo(video.id)}
                aria-label={`Remove ${video.title}`}
                title="Remove from Watch Later"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchLaterPage;
