// DetailPost/index.js
import "./DetailPost.scss";
import { useState, useEffect } from "react";
import { 
    ConfigIcon, 
    CloseIcon,
    LikeIcon,
    CommentIcon,
    ShareIcon,
    SendIcon
} from "../../../../../../components/assetsConvert";
import axios from "axios";

function DetailPost({ post, showDetail, handlingShow, userAvatar, userName }) {
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState("");
    const [likeCount, setLikeCount] = useState(post.userLikes?.length || 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Không tìm thấy token");
                return;
            }

            const response = await axios.post("http://localhost:8080/api/post-like", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    postId: post.id
                }
            });

            console.log("Like response:", response.data.result);
            // Update like count based on response
            setLikeCount(prev => prev + 1);
        } catch (err) {
            console.error("Error liking post:", err);
            setError("Có lỗi xảy ra khi thích bài viết");
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Không tìm thấy token");
                return;
            }

            const response = await axios.post("http://localhost:8080/api/comments", {
                postId: post.id,
                content: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Add new comment to list
            const newCommentData = {
                id: response.data.result.id,
                content: newComment,
                authorName: userName,
                authorAvatarUrl: userAvatar,
                createdTime: new Date().toISOString()
            };

            setComments(prev => [...prev, newCommentData]);
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("Có lỗi xảy ra khi thêm bình luận");
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
        <>
            <div className="detail-post-overlay" onClick={() => handlingShow()}></div>
            <div className="detail-post">
                <div className="detail-post__header">
                    <h2>Bài viết chi tiết</h2>
                    <button className="detail-post__close" onClick={() => handlingShow()}>
                        <CloseIcon />
                    </button>
                </div>

                <div className="detail-post__content">
                    {/* Post Header */}
                    <div className="detail-post__post-header">
                        <div className="detail-post__user">
                            <img 
                                src={post.authorAvatarUrl} 
                                alt={`${post.authorName} avatar`}
                                className="detail-post__avatar"
                            />
                            <div className="detail-post__user-info">
                                <h3 className="detail-post__author">{post.authorName}</h3>
                                <time className="detail-post__date">{formatDate(post.updatedTime)}</time>
                            </div>
                        </div>
                        
                        <div className="detail-post__actions">
                            <button className="detail-post__action-btn">
                                <ConfigIcon />
                            </button>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="detail-post__post-content">
                        {post.content && (
                            <p className="detail-post__text">{post.content}</p>
                        )}

                        {post.postMedia && post.postMedia.length > 0 && (
                            <div className="detail-post__media">
                                {post.postMedia.map((media, index) => (
                                    <div key={index} className="detail-post__image-wrapper">
                                        <img 
                                            src={media.url} 
                                            alt={`Media ${index + 1}`}
                                            className="detail-post__image"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
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

                    {/* Post Interactions */}
                    <div className="detail-post__interactions">
                        <button 
                            className="detail-post__interaction-btn"
                            onClick={handleLike}
                        >
                            <LikeIcon />
                            <span>Thích</span>
                        </button>
                        
                        <button className="detail-post__interaction-btn">
                            <CommentIcon />
                            <span>Bình luận</span>
                        </button>
                        
                        <button className="detail-post__interaction-btn">
                            <ShareIcon />
                            <span>Chia sẻ</span>
                        </button>
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
                                    rows="2"
                                />
                                <button 
                                    className="detail-post__send-btn"
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim() || loading}
                                >
                                    <SendIcon />
                                </button>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="detail-post__comments-list">
                            {comments.map((comment, index) => (
                                <div key={comment.id || index} className="detail-post__comment">
                                    <img 
                                        src={comment.authorAvatarUrl} 
                                        alt={`${comment.authorName} avatar`}
                                        className="detail-post__comment-avatar"
                                    />
                                    <div className="detail-post__comment-content">
                                        <div className="detail-post__comment-bubble">
                                            <strong className="detail-post__comment-author">
                                                {comment.authorName}
                                            </strong>
                                            <p className="detail-post__comment-text">
                                                {comment.content}
                                            </p>
                                        </div>
                                        <div className="detail-post__comment-actions">
                                            <button className="detail-post__comment-action">Thích</button>
                                            <button className="detail-post__comment-action">Phả hồi</button>
                                            <span className="detail-post__comment-time">
                                                {formatDate(comment.createdTime)}
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