import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, CheckCircle2 } from 'lucide-react';
import './TweetCard.css';

interface TweetCardProps {
  tweet: {
    id: string;
    user: { name: string; handle: string; avatar: string; verified: boolean };
    content: string;
    time: string;
    likes: number;
    comments: number;
    retweets: number;
    liked: boolean;
  };
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet }) => {
  const [liked, setLiked] = useState(tweet.liked);
  const [likes, setLikes] = useState(tweet.likes);
  const [retweeted, setRetweeted] = useState(false);
  const [retweets, setRetweets] = useState(tweet.retweets);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleRetweet = () => {
    setRetweeted(!retweeted);
    setRetweets(prev => retweeted ? prev - 1 : prev + 1);
  };

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

  return (
    <article className="tweet-card glass-card" id={`tweet-${tweet.id}`}>
      <div className="tweet-header">
        <img src={tweet.user.avatar} alt={tweet.user.name} className="avatar avatar-md" />
        <div className="tweet-user-info">
          <div className="tweet-user-name">
            {tweet.user.name}
            {tweet.user.verified && <CheckCircle2 size={14} className="tweet-verified" />}
          </div>
          <div className="tweet-user-handle">{tweet.user.handle}</div>
        </div>
        <span className="tweet-time">{tweet.time}</span>
      </div>

      <p className="tweet-content">{tweet.content}</p>

      <div className="tweet-actions">
        <button
          className={`tweet-action ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label={`Like — ${formatCount(likes)} likes`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          <span>{formatCount(likes)}</span>
        </button>

        <button className="tweet-action" aria-label={`Comment — ${tweet.comments} comments`}>
          <MessageCircle size={16} />
          <span>{tweet.comments}</span>
        </button>

        <button
          className={`tweet-action ${retweeted ? 'retweeted' : ''}`}
          onClick={handleRetweet}
          aria-label={`Retweet — ${formatCount(retweets)} retweets`}
        >
          <Repeat2 size={16} />
          <span>{formatCount(retweets)}</span>
        </button>

        <button className="tweet-action" aria-label="Share">
          <Share size={16} />
        </button>
      </div>
    </article>
  );
};

export default TweetCard;
