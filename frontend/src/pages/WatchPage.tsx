import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ThumbsUp, Share2, Bookmark, Bell, BellOff,
  CheckCircle2, ChevronDown, ChevronUp, Send,
  MoreHorizontal, Heart, MessageCircle, Loader2,
  BookmarkPlus, X, Plus, Check
} from 'lucide-react';
import VideoCard from '../components/VideoCard';
import {
  getVideoById, getVideos, getComments, addComment,
  toggleVideoLike, getVideoLikes,
  toggleSubscription, getSubscriptionStatus,
  getUserPlaylists, createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import './WatchPage.css';

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const getVideoThumbnail = (thumbnail: string, videoFile: string): string => {
  if (thumbnail) return thumbnail;
  if (!videoFile || !videoFile.includes('cloudinary.com')) return '';
  const match = videoFile.match(/cloudinary\.com\/([^/]+)\/(?:video|image)\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  if (!match) return '';
  const [, cloudName, publicId] = match;
  if (videoFile.includes('/video/upload/')) {
    return `https://res.cloudinary.com/${cloudName}/video/upload/so_30p,w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_640,h_360,c_fill,q_auto,f_jpg/${publicId}.jpg`;
};

const formatDuration = (secs: number): string => {
  if (!secs) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Video & related
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Like
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Subscribe
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  // Comments
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Description
  const [descExpanded, setDescExpanded] = useState(false);

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [startAt, setStartAt] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Save to playlist modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [savedToPlaylists, setSavedToPlaylists] = useState<Set<string>>(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ── Fetch video + related + comments + like status + sub status ──
  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const [videoRes, relatedRes, commentsRes] = await Promise.all([
          getVideoById(id),
          getVideos({ limit: 10, sortBy: 'views', sortType: 'desc' }),
          getComments(id, 1, 20).catch(() => ({ data: [] })),
        ]);

        const v = videoRes?.data ?? null;
        setVideo(v);

        const docs = relatedRes?.data?.docs ?? relatedRes?.data ?? [];
        setRelated(Array.isArray(docs) ? docs.filter((x: any) => x._id !== id) : []);

        const cDocs = commentsRes?.data?.docs ?? commentsRes?.data ?? [];
        setComments(Array.isArray(cDocs) ? cDocs : []);

        // Fetch like + subscription status only if logged in
        if (isLoggedIn && v) {
          const [likeRes, subRes] = await Promise.all([
            getVideoLikes(id).catch(() => null),
            getSubscriptionStatus(v.owner?._id).catch(() => null),
          ]);
          setLiked(likeRes?.data?.isLiked ?? false);
          setLikeCount(likeRes?.data?.likeCount ?? 0);
          setSubscribed(subRes?.data?.subscribed ?? false);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, isLoggedIn]);

  // ── Like ──
  const handleLike = async () => {
    if (!isLoggedIn) { navigate('/login', { state: { from: `/watch/${id}` } }); return; }
    if (likeLoading || !id) return;
    setLikeLoading(true);
    try {
      const res = await toggleVideoLike(id);
      const nowLiked = res?.data?.liked ?? !liked;
      setLiked(nowLiked);
      setLikeCount(c => nowLiked ? c + 1 : Math.max(0, c - 1));
    } catch (e) { console.error(e); }
    finally { setLikeLoading(false); }
  };

  // ── Subscribe ──
  const handleSubscribe = async () => {
    if (!isLoggedIn) { navigate('/login', { state: { from: `/watch/${id}` } }); return; }
    if (subLoading || !video?.owner?._id) return;
    setSubLoading(true);
    try {
      const res = await toggleSubscription(video.owner._id);
      setSubscribed(res?.data?.subscribed ?? !subscribed);
    } catch (e) { console.error(e); }
    finally { setSubLoading(false); }
  };

  // ── Share ──
  const getShareUrl = () => {
    const base = window.location.href.split('?')[0];
    return startAt && currentTime > 0 ? `${base}?t=${Math.floor(currentTime)}` : base;
  };

  const handleShare = () => {
    const t = videoRef.current?.currentTime ?? 0;
    setCurrentTime(t);
    setLinkCopied(false);
    setStartAt(false);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard?.writeText(getShareUrl());
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      color: '#25D366',
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.851L.057 23.012a.75.75 0 0 0 .931.931l5.161-1.474A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 0 1-4.953-1.355l-.355-.212-3.664 1.047 1.048-3.587-.231-.368A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      ),
      href: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      color: '#1877F2',
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'X',
      color: '#000',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: (url: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(video?.title ?? '')}`,
    },
    {
      name: 'Telegram',
      color: '#229ED9',
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      href: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(video?.title ?? '')}`,
    },
    {
      name: 'LinkedIn',
      color: '#0A66C2',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      href: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Reddit',
      color: '#FF4500',
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      href: (url: string) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(video?.title ?? '')}`,
    },
  ];

  // ── Save modal ──
  const openSaveModal = async () => {
    if (!isLoggedIn) { navigate('/login', { state: { from: `/watch/${id}` } }); return; }
    setShowSaveModal(true);
    setShowCreateForm(false);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setPlaylistsLoading(true);
    try {
      const res = await getUserPlaylists();
      const fetched: any[] = res?.data ?? [];
      setPlaylists(fetched);
      // Pre-mark playlists that already contain this video
      const alreadySaved = new Set<string>(
        fetched
          .filter((pl: any) => pl.videos?.some((v: any) =>
            (typeof v === 'string' ? v : v._id) === id
          ))
          .map((pl: any) => pl._id)
      );
      setSavedToPlaylists(alreadySaved);
    } catch { setPlaylists([]); setSavedToPlaylists(new Set()); }
    finally { setPlaylistsLoading(false); }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!id) return;
    const alreadySaved = savedToPlaylists.has(playlistId);
    try {
      if (alreadySaved) {
        // Remove from playlist
        await removeVideoFromPlaylist(playlistId, id);
        setSavedToPlaylists(prev => {
          const next = new Set(prev);
          next.delete(playlistId);
          return next;
        });
        // decrement local count
        setPlaylists(prev => prev.map(pl =>
          pl._id === playlistId
            ? { ...pl, videos: (pl.videos ?? []).filter((v: any) => (v._id ?? v) !== id) }
            : pl
        ));
      } else {
        // Add to playlist
        await addVideoToPlaylist(playlistId, id);
        setSavedToPlaylists(prev => new Set([...prev, playlistId]));
        setPlaylists(prev => prev.map(pl =>
          pl._id === playlistId
            ? { ...pl, videos: [...(pl.videos ?? []), { _id: id }] }
            : pl
        ));
      }
    } catch (e: any) {
      // If "already in playlist" error — just mark as saved
      if (!alreadySaved) {
        setSavedToPlaylists(prev => new Set([...prev, playlistId]));
      }
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim() || !id) return;
    setCreatingPlaylist(true);
    try {
      const res = await createPlaylist(newPlaylistName.trim(), newPlaylistDesc.trim() || 'My playlist');
      const created = res?.data;
      if (created) {
        await addVideoToPlaylist(created._id, id);
        setPlaylists(prev => [created, ...prev]);
        setSavedToPlaylists(prev => new Set([...prev, created._id]));
        setNewPlaylistName('');
        setNewPlaylistDesc('');
      }
    } catch (e) { console.error(e); }
    finally { setCreatingPlaylist(false); }
  };

  // ── Comment ──
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id || !isLoggedIn) return;
    setSubmittingComment(true);
    try {
      const res = await addComment(id, commentText.trim());
      const newComment = res?.data;
      if (newComment) setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (e) { console.error(e); }
    finally { setSubmittingComment(false); }
  };

  // ── Render ──
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="watch-page page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Video not found</h2>
          <p>{error || 'This video may have been removed or is unavailable.'}</p>
        </div>
      </div>
    );
  }

  const isOwnVideo = isLoggedIn && video.owner?._id === user?._id;

  return (
    <div className="watch-page page-container">
      {/* Share modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowShareModal(false)}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 18, padding: '28px 24px', width: 420, maxWidth: '92vw',
          }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Share</h3>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
              {socialPlatforms.map(p => (
                <a
                  key={p.name}
                  href={p.href(getShareUrl())}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}
                >
                  <div style={{
                    width: 54, height: 54, borderRadius: '50%',
                    background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 2px 12px ${p.color}55`,
                    transition: 'transform 0.15s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {p.icon}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{p.name}</span>
                </a>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 20px' }} />

            {/* Copy link */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '10px 14px',
            }}>
              <span style={{
                flex: 1, overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', fontSize: 13, color: 'var(--text-secondary)',
              }}>
                {getShareUrl()}
              </span>
              <button
                onClick={copyShareLink}
                style={{
                  background: linkCopied ? 'rgba(74,222,128,0.15)' : 'linear-gradient(135deg,#a855f7,#ec4899)',
                  border: 'none', borderRadius: 8, padding: '7px 16px',
                  color: linkCopied ? '#4ade80' : '#fff',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {linkCopied ? <><Check size={14} /> Copied!</> : 'Copy'}
              </button>
            </div>

            {/* Start at */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
              <input
                type="checkbox"
                id="start-at-check"
                checked={startAt}
                onChange={e => setStartAt(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#a855f7', cursor: 'pointer' }}
              />
              <label htmlFor="start-at-check" style={{ fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                Start at <span style={{ color: '#a855f7', fontWeight: 600 }}>{formatTime(currentTime)}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Save to playlist modal */}
      {showSaveModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowSaveModal(false)}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 24, width: 360, maxWidth: '90vw',
            maxHeight: '80vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Save to playlist</h3>
              <button onClick={() => setShowSaveModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {playlistsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
              </div>
            ) : (
              <>
                {playlists.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>No playlists yet. Create one below.</p>
                )}
                {playlists.map((pl: any) => (
                  <div key={pl._id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{pl.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{pl.videos?.length ?? 0} videos</div>
                    </div>
                    <button
                      onClick={() => handleAddToPlaylist(pl._id)}
                      style={{
                        background: savedToPlaylists.has(pl._id) ? 'rgba(168,85,247,0.15)' : 'var(--bg-secondary)',
                        border: `1px solid ${savedToPlaylists.has(pl._id) ? '#a855f7' : 'var(--border)'}`,
                        borderRadius: 8,
                        padding: '6px 14px', cursor: 'pointer',
                        color: savedToPlaylists.has(pl._id) ? '#a855f7' : 'var(--text-primary)',
                        fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.15s',
                      }}
                    >
                      {savedToPlaylists.has(pl._id)
                        ? <><Check size={13} /> Saved</>
                        : <><Plus size={13} /> Add</>
                      }
                    </button>
                  </div>
                ))}

                {/* Create new playlist */}
                <div style={{ marginTop: 16 }}>
                  {!showCreateForm ? (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', border: '1px dashed var(--border)',
                        borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
                        color: 'var(--text-secondary)', fontSize: 14, width: '100%',
                      }}
                    >
                      <Plus size={16} /> New playlist
                    </button>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>New playlist</p>
                        <button onClick={() => { setShowCreateForm(false); setNewPlaylistName(''); setNewPlaylistDesc(''); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          <X size={15} />
                        </button>
                      </div>
                      <input
                        type="text" placeholder="Playlist name *"
                        value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)}
                        autoFocus
                        style={{
                          width: '100%', padding: '8px 12px', borderRadius: 8, marginBottom: 8,
                          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                          color: 'var(--text-primary)', fontSize: 13, boxSizing: 'border-box',
                        }}
                      />
                      <input
                        type="text" placeholder="Description (optional)"
                        value={newPlaylistDesc} onChange={e => setNewPlaylistDesc(e.target.value)}
                        style={{
                          width: '100%', padding: '8px 12px', borderRadius: 8, marginBottom: 12,
                          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                          color: 'var(--text-primary)', fontSize: 13, boxSizing: 'border-box',
                        }}
                      />
                      <button
                        onClick={handleCreatePlaylist}
                        disabled={!newPlaylistName.trim() || creatingPlaylist}
                        style={{
                          width: '100%', padding: '10px', borderRadius: 8, cursor: 'pointer',
                          background: 'linear-gradient(135deg,#a855f7,#ec4899)',
                          border: 'none', color: '#fff', fontWeight: 600, fontSize: 14,
                          opacity: (!newPlaylistName.trim() || creatingPlaylist) ? 0.5 : 1,
                        }}
                      >
                        {creatingPlaylist ? 'Creating...' : 'Create & Save'}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="watch-layout">
        {/* Left: Player + Info */}
        <div className="watch-main">
          {/* Video Player */}
          <div className="video-player-container" id="video-player">
            <div style={{ background: '#000', borderRadius: 12, overflow: 'hidden' }}>
              <video
                ref={videoRef}
                src={video.videoFile}
                poster={getVideoThumbnail(video.thumbnail, video.videoFile) || undefined}
                controls
                style={{ width: '100%', display: 'block', maxHeight: 520, background: '#000' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Title */}
          <div className="watch-info">
            <h1 className="watch-title">{video.title}</h1>

            {/* Channel row + action buttons */}
            <div className="watch-actions">
              <div className="watch-channel">
                <img
                  src={video.owner?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.owner?.username}`}
                  alt=""
                  className="avatar avatar-lg"
                />
                <div className="watch-channel-info">
                  <div className="watch-channel-name">
                    {video.owner?.fullName || video.owner?.username}
                  </div>
                  <div className="watch-subs">@{video.owner?.username}</div>
                </div>

                {/* Subscribe — hide if own video */}
                {!isOwnVideo && (
                  <button
                    className={`btn ${subscribed ? 'btn-secondary' : 'btn-red'} sub-btn`}
                    onClick={handleSubscribe}
                    disabled={subLoading}
                    id="subscribe-btn"
                  >
                    {subLoading ? (
                      <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} />
                    ) : subscribed ? (
                      <><BellOff size={15} /> Subscribed</>
                    ) : (
                      <><Bell size={15} /> Subscribe</>
                    )}
                  </button>
                )}
              </div>

              <div className="watch-reaction-btns">
                {/* Like */}
                <button
                  className={`like-btn ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                  disabled={likeLoading}
                  id="like-btn"
                  aria-label="Like"
                >
                  <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'} />
                  {likeCount > 0 ? likeCount.toLocaleString() : 'Like'}
                </button>

                {/* Share */}
                <button className="btn btn-secondary action-btn" onClick={handleShare} id="share-btn">
                  <Share2 size={16} /> Share
                </button>

                {/* Save */}
                <button className="btn btn-secondary action-btn" onClick={openSaveModal} id="save-btn">
                  <Bookmark size={16} /> Save
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="watch-meta-bar">
              <span>{video.views?.toLocaleString()} views</span>
              <span className="meta-dot">·</span>
              <span>{timeAgo(video.createdAt)}</span>
              <span className="meta-dot">·</span>
              <span>{formatDuration(video.duration)}</span>
            </div>

            {/* Description */}
            {video.discription && (
              <>
                <div className={`watch-description ${descExpanded ? 'expanded' : ''}`}>
                  <p>{video.discription}</p>
                </div>
                <button className="desc-toggle" onClick={() => setDescExpanded(e => !e)} id="desc-toggle-btn">
                  {descExpanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
                </button>
              </>
            )}
          </div>

          {/* Comments */}
          <div className="comments-section" id="comments-section">
            <h2 className="comments-title">{comments.length} Comments</h2>

            {isLoggedIn ? (
              <form className="add-comment" onSubmit={handleComment} id="comment-form">
                <img
                  src={user?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  alt=""
                  className="avatar avatar-md"
                />
                <div className="comment-input-wrap">
                  <input
                    type="text"
                    className="input comment-input"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    id="comment-input"
                  />
                  {commentText && (
                    <div className="comment-form-actions">
                      <button type="button" className="btn btn-ghost" onClick={() => setCommentText('')}>Cancel</button>
                      <button type="submit" className="btn btn-primary" id="comment-submit-btn" disabled={submittingComment}>
                        <Send size={14} /> {submittingComment ? 'Posting...' : 'Comment'}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
                <Link to="/login" style={{ color: '#a855f7' }}>Sign in</Link> to leave a comment.
              </p>
            )}

            <div className="comments-list">
              {comments.map((comment: any) => (
                <div key={comment._id} className="comment">
                  <img
                    src={comment.owner?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.owner?.username}`}
                    alt=""
                    className="avatar avatar-md"
                  />
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">{comment.owner?.fullName || comment.owner?.username || 'User'}</span>
                      <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                      <button className="like-btn" style={{ padding: '4px 10px', fontSize: '12px' }}>
                        <Heart size={13} /> 0
                      </button>
                      <button className="btn-ghost comment-reply-btn" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        <MessageCircle size={13} /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Related */}
        <aside className="watch-sidebar" id="watch-sidebar">
          <h2 className="sidebar-section-title">Up Next</h2>
          <div className="related-videos">
            {related.map((v: any) => (
              <VideoCard
                key={v._id}
                id={v._id}
                title={v.title}
                thumbnail={getVideoThumbnail(v.thumbnail, v.videoFile)}
                duration={formatDuration(v.duration)}
                views={v.views?.toLocaleString() ?? '0'}
                uploadedAt={timeAgo(v.createdAt)}
                channel={{
                  name: v.owner?.fullName || v.owner?.username || 'Unknown',
                  avatar: v.owner?.avtar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${v.owner?.username}`,
                  verified: false,
                }}
                compact
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchPage;
