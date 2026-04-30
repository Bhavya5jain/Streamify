import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ThumbsUp, ThumbsDown, Share2, Bookmark, Bell,
  CheckCircle2, ChevronDown, ChevronUp, Send,
  MoreHorizontal, Flag, Heart, MessageCircle
} from 'lucide-react';
import VideoCard from '../components/VideoCard';
import TweetCard from '../components/TweetCard';
import { mockVideos, mockComments, mockTweets, currentUser } from '../data/mockData';
import './WatchPage.css';

const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const video = mockVideos.find(v => v.id === id) || mockVideos[0];
  const related = mockVideos.filter(v => v.id !== video.id);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(mockComments);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (!disliked) setLiked(false);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      user: { name: currentUser.name, avatar: currentUser.avatar, verified: currentUser.verified },
      content: commentText,
      time: 'just now',
      likes: 0,
      liked: false,
      replies: [],
    };
    setComments(prev => [newComment, ...prev]);
    setCommentText('');
  };

  const toggleReplies = (id: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="watch-page page-container">
      <div className="watch-layout">
        {/* Left: Player + Info */}
        <div className="watch-main">
          {/* Video Player */}
          <div className="video-player-container" id="video-player">
            <div className="video-player-wrap">
              <img src={video.thumbnail} alt={video.title} className="video-player-thumb" />
              <div className="video-player-overlay">
                <div className="player-play-btn">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="player-controls">
                <div className="player-progress">
                  <div className="player-progress-fill" style={{ width: '34%' }} />
                </div>
                <div className="player-bottom">
                  <div className="player-time">14:22 / {video.duration}</div>
                  <div className="player-right-controls">
                    <span className="player-quality">1080p</span>
                    <span className="player-fullscreen">⛶</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="watch-info">
            <h1 className="watch-title">{video.title}</h1>

            <div className="watch-actions">
              <div className="watch-channel">
                <img src={video.channel.avatar} alt="" className="avatar avatar-lg" />
                <div className="watch-channel-info">
                  <div className="watch-channel-name">
                    {video.channel.name}
                    {video.channel.verified && <CheckCircle2 size={14} className="verified-icon" />}
                  </div>
                  <div className="watch-subs">2.4M subscribers</div>
                </div>
                <button
                  className={`btn ${subscribed ? 'btn-secondary subscribed' : 'btn-red'} sub-btn`}
                  onClick={() => setSubscribed(!subscribed)}
                  id="subscribe-btn"
                >
                  {subscribed ? <><Bell size={16} /> Subscribed</> : 'Subscribe'}
                </button>
              </div>

              <div className="watch-reaction-btns">
                <div className="like-dislike-group">
                  <button
                    className={`like-btn ${liked ? 'liked' : ''}`}
                    onClick={handleLike}
                    id="like-btn"
                    aria-label="Like"
                  >
                    <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'} />
                    {liked ? '128K' : '127K'}
                  </button>
                  <div className="btn-divider" />
                  <button
                    className={`like-btn ${disliked ? 'liked' : ''}`}
                    onClick={handleDislike}
                    id="dislike-btn"
                    aria-label="Dislike"
                  >
                    <ThumbsDown size={16} fill={disliked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <button className="btn btn-secondary action-btn" id="share-btn">
                  <Share2 size={16} /> Share
                </button>
                <button className="btn btn-secondary action-btn" id="save-btn">
                  <Bookmark size={16} /> Save
                </button>
                <button className="btn-icon" id="more-options-btn" aria-label="More options">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Video Meta */}
            <div className="watch-meta-bar">
              <span>{video.views} views</span>
              <span className="meta-dot">·</span>
              <span>{video.uploadedAt}</span>
              <span className="meta-dot">·</span>
              <span className="badge badge-purple">{video.category}</span>
            </div>

            {/* Description */}
            <div className={`watch-description ${descExpanded ? 'expanded' : ''}`}>
              <p>
                In this comprehensive tutorial, we'll walk through building a complete full-stack
                application from scratch using React, Node.js, Express, and MongoDB. We cover
                authentication, REST API design, state management with Redux Toolkit, and
                deployment to production using Docker and AWS.
              </p>
              <p>
                🔗 Source code: github.com/codewith-alex/fullstack-2025<br/>
                📱 Follow on Twitter: @codewith_alex<br/>
                ⭐ Star the repo if you found this helpful!
              </p>
              <div className="description-tags">
                <span className="tag">#React</span>
                <span className="tag">#NodeJS</span>
                <span className="tag">#WebDev</span>
                <span className="tag">#Tutorial</span>
              </div>
            </div>
            <button
              className="desc-toggle"
              onClick={() => setDescExpanded(!descExpanded)}
              id="desc-toggle-btn"
            >
              {descExpanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show more</>}
            </button>
          </div>

          {/* Comments */}
          <div className="comments-section" id="comments-section">
            <h2 className="comments-title">
              {comments.length.toLocaleString()} Comments
            </h2>

            {/* Add comment */}
            <form className="add-comment" onSubmit={handleComment} id="comment-form">
              <img src={currentUser.avatar} alt="" className="avatar avatar-md" />
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
                    <button type="submit" className="btn btn-primary" id="comment-submit-btn">
                      <Send size={14} /> Comment
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comment list */}
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment" id={`comment-${comment.id}`}>
                  <img src={comment.user.avatar} alt="" className="avatar avatar-md" />
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.user.name}
                        {comment.user.verified && <CheckCircle2 size={12} className="verified-icon" />}
                      </span>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                      <button className={`like-btn ${comment.liked ? 'liked' : ''}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
                        <Heart size={13} fill={comment.liked ? 'currentColor' : 'none'} />
                        {comment.likes}
                      </button>
                      <button className="btn-ghost comment-reply-btn" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        <MessageCircle size={13} /> Reply
                      </button>
                      <button className="btn-ghost" style={{ fontSize: '12px', padding: '4px 8px' }}>
                        <Flag size={12} />
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <>
                        <button
                          className="show-replies-btn"
                          onClick={() => toggleReplies(comment.id)}
                        >
                          {expandedReplies.has(comment.id)
                            ? <><ChevronUp size={14} /> Hide replies</>
                            : <><ChevronDown size={14} /> {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</>
                          }
                        </button>
                        {expandedReplies.has(comment.id) && (
                          <div className="replies-list">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="comment reply-comment">
                                <img src={reply.user.avatar} alt="" className="avatar avatar-sm" />
                                <div className="comment-body">
                                  <div className="comment-header">
                                    <span className="comment-author">
                                      {reply.user.name}
                                      {reply.user.verified && <CheckCircle2 size={11} className="verified-icon" />}
                                    </span>
                                    <span className="comment-time">{reply.time}</span>
                                  </div>
                                  <p className="comment-text">{reply.content}</p>
                                  <div className="comment-actions">
                                    <button className="like-btn" style={{ padding: '4px 10px', fontSize: '12px' }}>
                                      <Heart size={12} /> {reply.likes}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tweet Discussion */}
          <div className="tweet-discussion" id="tweet-discussion">
            <h2 className="comments-title" style={{ marginBottom: '16px' }}>Discussion</h2>
            <div className="tweets-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mockTweets.slice(0, 2).map(tweet => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Related Videos */}
        <aside className="watch-sidebar" id="watch-sidebar">
          <h2 className="sidebar-section-title">Up Next</h2>
          <div className="related-videos">
            {related.map(v => (
              <VideoCard key={v.id} {...v} compact />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchPage;
