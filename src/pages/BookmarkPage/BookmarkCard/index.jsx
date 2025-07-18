import { useState } from "react";
import { Heart, MessageCircle, Image, Bookmark, ImageIcon } from "lucide-react";
import "./BookmarkCard.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GetApiBaseUrl from "../../../helpers/GetApiBaseUrl";
import { toast } from "react-toastify";

function BookmarkCard({ post, onViewDetail, onUnsave, userAvatar, userName }) {
    const navigate = useNavigate();

    const API_BASE_URL = GetApiBaseUrl();

    const handlingBookmark = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const res = await axios.post(`${API_BASE_URL}/api/bookmarks/create`, {
                postId: post.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            
            toast.success(res.data.result);
        } catch (error) {
            toast.error(error);
        }
    }

    const handleCardClick = () => {
        onViewDetail(post);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="bookmark-card">
            <div className="bookmark-card__media"  onClick={handleCardClick}>
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
                    <div className="bookmark-card__header-left" onClick={() => navigate(`/profile/${post.authorId}`)}>
                        <img 
                            src={post.authorAvatarUrl} 
                            alt={post.authorName}
                            className="bookmark-card__avatar"
                        />
                        <span className="bookmark-card__author">
                            {post.authorName}
                        </span>
                    </div>
                    <div className="bookmark-card__header-right">
                        <button 
                            className="bookmark-card__unsave-btn "
                            onClick={handlingBookmark}
                            title="Bỏ lưu"
                        >
                            <Bookmark size={20} fill={post.saved ? '#fff' : 'none'} />
                        </button>
                    </div>
                </div>

                {post.content && (
                    <div className="bookmark-card__text"  onClick={handleCardClick}>
                        {post.content}
                    </div>
                )}

                <div className="bookmark-card__footer"  onClick={handleCardClick}>
                    <div className="bookmark-card__stats">
                        <span>
                            <Heart size={14} />
                            {post.userLikes.length}
                        </span>
                        <span>
                            <MessageCircle size={14} />
                            {post.comments.length}
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