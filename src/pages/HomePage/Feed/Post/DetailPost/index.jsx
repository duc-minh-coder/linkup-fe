import "./DetailPost.scss";
import { useState, useEffect, useRef } from "react";
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../DropdownMenu";
import GetApiBaseUrl from "../../../../../helpers/GetApiBaseUrl";
import { toast } from "react-toastify";

function DetailPost({ post, handlingShow, userAvatar, userName, isAuthor }) {
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState("");
    const [likeCount, setLikeCount] = useState(post.userLikes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const API_BASE_URL = GetApiBaseUrl();

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEditPost = () => {
        setShowEditModal(true);
        setShowDropdown(false);
    }

    const handleHidePost = () => {

    }

    const handleDeletePost = () => {

    }

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

    
    const handlingSetDropdown = () => {
        setShowDropdown(false);
    }
    
    const handleLikePost = () => {
        const token = localStorage.getItem('token');

        try {
            axios.post(`${API_BASE_URL}/api/post-like/toggle-like`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }, params: {
                    postId: post.id
                }
            }).then(() => {
                setIsLiked(true);
            })
        } catch (error) {
            console.log(error);
            
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            
            if (!token) return;

            const response = await axios.post(`${API_BASE_URL}/api/comments`, {
                postId: post.id,
                content: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    const handlingOpenFriendProfile = () => {
        navigate(`/profile/${post.authorId}`);
    }

    const handleBookmark = () => {
        handlingBookmark();
    }

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

    const nextImage = () => {
        setCurrentImageIndex(prev => 
            prev < post.postMedia.length - 1 ? prev + 1 : 0
        );
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => 
            prev > 0 ? prev - 1 : post.postMedia.length - 1
        );
    };

    return (
        <>
            <div className="detail-post-overlay" onClick={() => handlingShow()}></div>
            <div className="detail-post">
                <div className="detail-post__header">
                    <h2>Bài viết chi tiết</h2>
                    <button className="detail-post__close" onClick={() => handlingShow()}>
                        <X size={20} />
                    </button>
                </div>

                <div className="detail-post__content">
                    {/* Post Header */}
                    <div className="detail-post__post-header">
                        <div className="detail-post__user">
                            <img 
                                src={post.authorAvatarUrl} 
                                alt={post.authorName}
                                className="detail-post__avatar"
                                onClick={handlingOpenFriendProfile}
                            />
                            <div className="detail-post__user-info">
                                <h3 className="detail-post__author">{post.authorName}</h3>
                                <time className="detail-post__date">{formatDate(post.updatedTime)}</time>
                            </div>
                        </div>
                        
                        <div className="detail-post__actions">
                            <button className="detail-post__action-btn">
                                <MoreHorizontal size={20} onClick={() => setShowDropdown(!showDropdown)}/>
                            </button>

                            {showDropdown && 
                                <DropdownMenu 
                                    isAuthor={isAuthor} 
                                    handleEditPost={handleEditPost} 
                                    handleDeletePost={handleDeletePost} 
                                    handlingSetDropdown={handlingSetDropdown}
                            />}                        
                        </div>


                    </div>

                    {/* Post Content */}
                    {post.content && (
                        <div className="detail-post__post-content">
                            <span>{post.content}</span>
                        </div>
                    )}

                    {/* Post Media */}
                    {post.postMedia && post.postMedia.length > 0 && (
                        <div className="detail-post__media-wrapper">
                            <img
                                src={post.postMedia[currentImageIndex]?.url}
                                alt={`Ảnh ${currentImageIndex + 1}`}
                                className="detail-post__image"
                            />

                            {post.postMedia.length > 1 && (
                                <>
                                    <button 
                                        onClick={prevImage}
                                        className="detail-post__nav-btn prev"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <button 
                                        onClick={nextImage}
                                        className="detail-post__nav-btn next"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Post Actions */}
                    <div className="detail-post__interactions">
                        <div className="detail-post__interactions-left">
                            <button 
                                className={`detail-post__interaction-btn ${post.liked ? 'detail-post__interaction-btn--liked' : ''}`}
                                onClick={handleLikePost}
                            >
                                <Heart 
                                    size={24} 
                                    fill={isLiked ? '#f11' : 'none'}
                                />
                            </button>
                            
                            <button className="detail-post__interaction-btn">
                                <MessageCircle size={24} />
                            </button>
                            
                            <button className="detail-post__interaction-btn">
                                <Send size={24} />
                            </button>
                        </div>

                        <button 
                            className={`detail-post__interaction-btn ${isSaved ? 'detail-post__interaction-btn--saved' : ''}`}
                            onClick={() => setIsSaved(!isSaved)}
                        >
                            <Bookmark 
                                size={24} 
                                fill={post.saved ? '#fff' : 'none'}
                                onClick={handleBookmark}
                            />
                        </button>
                    </div>

                    {/* Post Stats */}
                    <div className="detail-post__stats">
                        <span className="detail-post__stat">
                            {likeCount} lượt thích
                        </span>
                        <span className="detail-post__stat">
                            {comments.length} bình luận
                        </span>
                    </div>

                    {/* Comments Section */}
                    <div className="detail-post__comments">
                        <h4>Bình luận</h4>
                        
                        {/* Add Comment */}
                        <div className="detail-post__add-comment">
                            <img 
                                src={userAvatar} 
                                alt="Your avatar"
                                className="detail-post__comment-avatar"
                            />
                            <div className="detail-post__comment-input-wrapper">
                                <textarea
                                    className="detail-post__comment-input"
                                    placeholder="Viết bình luận..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    rows="1"
                                />

                                <button 
                                    className="detail-post__send-btn"
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim() || loading}
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="detail-post__comments-list">
                            {comments.map((comment, index) => (
                                <div key={comment.id || index} className="detail-post__comment">
                                    <img 
                                        src={comment.avatarUrl} 
                                        alt={comment.fullName}
                                        className="detail-post__comment-avatar"
                                    />
                                    <div className="detail-post__comment-content">
                                        <div className="detail-post__comment-bubble">
                                            <strong className="detail-post__comment-author">
                                                {comment.fullName}
                                            </strong>
                                            <p className="detail-post__comment-text">
                                                {comment.content}
                                            </p>
                                        </div>
                                        <div className="detail-post__comment-actions">
                                            <button className="detail-post__comment-action">Thích</button>
                                            {/* <button className="detail-post__comment-action" onClick={handlingReplyComment}>Phản hồi</button> */}
                                            <span className="detail-post__comment-time">
                                                {formatDate(comment.updatedTime)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {comments.length === 0 && (
                            <div className="detail-post__no-comments">
                                <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="detail-post__error">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>Đóng</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default DetailPost;