import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Search, Home, Compass, PlusSquare, User, Menu } from 'lucide-react';
import { useState } from 'react';
import "./Post.scss";

function Post({ username, avatar, image, likes, timeAgo }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="post">
      <div className="post__header">
        <div className="post__user">
          <img src={avatar} alt={username} className="post__user-avatar" />
          <div className="post__user-info">
            <span className="post__username">{username}</span>
            <span className="post__time-ago">{timeAgo}</span>
          </div>
        </div>
        <MoreHorizontal size={20} className="post__options" />
      </div>
      
      <div className="post__image">
        <img src={image} alt="Post" />
      </div>
      
      <div className="post__actions">
        <div className="post__actions-left">
          <Heart 
            size={24} 
            className={`post__action-icon ${isLiked ? 'post__action-icon--liked' : ''}`}
            onClick={() => setIsLiked(!isLiked)}
          />
          <MessageCircle size={24} className="post__action-icon" />
          <Send size={24} className="post__action-icon" />
        </div>
        <Bookmark 
          size={24} 
          className={`post__action-icon ${isSaved ? 'post__action-icon--saved' : ''}`}
          onClick={() => setIsSaved(!isSaved)}
        />
      </div>
      
      <div className="post__info">
        <div className="post__likes">{likes} lượt thích</div>
        <div className="post__description">
          <span className="post__username">{username}</span>
          <span className="post__description-text">Beautiful view from the bridge! 🌉</span>
        </div>
      </div>
    </div>
  );
};

export default Post;