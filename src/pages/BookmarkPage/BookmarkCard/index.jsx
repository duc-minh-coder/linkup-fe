import { useState } from "react";
import { Heart, MessageCircle, Image, BookmarkX, ImageIcon } from "lucide-react";
import "./BookmarkCard.scss";

function BookmarkCard({ post, onViewDetail, onUnsave, userAvatar, userName }) {
    const [isUnsaving, setIsUnsaving] = useState(false);

    const handleUnsave = async (e) => {
        e.stopPropagation();
        setIsUnsaving(true);
        
        try {
            await onUnsave(post.id);
        } catch (error) {
            console.error("Error unsaving post:", error);
        } finally {
            setIsUnsaving(false);
        }
    };

    const handleCardClick = () => {
        onViewDetail(post);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return "Hôm nay";
        } else if (diffDays === 1) {
            return "Hôm qua";
        } else if (diffDays < 7) {
            return `${diffDays} ngày trước`;
        } else {
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    };

    const formatCount = (count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    };

    return (
        <div className="bookmark-card" onClick={handleCardClick}>
            <div className="bookmark-card__media">
                {post.postMedia && post.postMedia.length > 0 && (
                    <>
                        <img 
                            src={post.postMedia[0].url} 
                            alt="Post media"
                            loading="lazy"
                        />
                        {post.postMedia.length > 1 && (
                            <div className="bookmark-card__media-count">
                                <Image size={12} />
                                {post.postMedia.length}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="bookmark-card__content">
                <div className="bookmark-card__header">
                    <div className="bookmark-card__header-left">
                        <img 
                            src={post.authorAvatarUrl || userAvatar} 
                            alt={post.authorName}
                            className="bookmark-card__avatar"
                        />
                        <span className="bookmark-card__author">
                            {post.authorName}
                        </span>
                    </div>
                    <div className="bookmark-card__header-right">
                        <button 
                            className="bookmark-card__unsave-btn"
                            onClick={handleUnsave}
                            disabled={isUnsaving}
                            title="Bỏ lưu"
                        >
                            <BookmarkX size={18} />
                        </button>
                    </div>
                </div>

                {post.content && (
                    <div className="bookmark-card__text">
                        {post.content}
                    </div>
                )}

                <div className="bookmark-card__footer">
                    <div className="bookmark-card__stats">
                        <span>
                            <Heart size={14} />
                            {formatCount(post.userLikes?.length || 0)}
                        </span>
                        <span>
                            <MessageCircle size={14} />
                            {formatCount(post.comments?.length || 0)}
                        </span>
                    </div>
                    <div className="bookmark-card__date">
                        {formatDate(post.updatedTime)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookmarkCard;