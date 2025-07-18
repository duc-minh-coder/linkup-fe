import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal
} from "lucide-react";
import "./Post.scss";
import DetailPost from "./DetailPost";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import EditPostModal from "./EditPostModal";
import DropdownMenu from "./DropdownMenu";
import axios from "axios";
import GetApiBaseUrl from "../../../../helpers/GetApiBaseUrl";
import { toast } from "react-toastify";

function Post({ post, userProfile }) {
    const [isLiked, setIsLiked] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const isAuthor = userProfile && String(userProfile.id) === String(post.authorId);
    const API_BASE_URL = GetApiBaseUrl();
    

    const handlingShow = () => {
        setShowDetail(false);
    }

    const handlingOpenProfile = (e) => {        
        navigate(`/profile/${post.authorId}`)
    }

    const handlingShare = () => {

    }

    const handleEditPost = () => {
        setShowEditModal(true);
        setShowDropdown(false);
    }

    const handleHidePost = () => {

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

    const handleDeletePost = () => {
        const token = localStorage.getItem('token');

        try {
            axios.delete(`${API_BASE_URL}/api/posts/${post.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
                .then(() => {
                    toast.success("đã xoá bài viết!");

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                })
                .catch(() => {
                    toast.error("chưa xoá được bài viết");
                })
        }   
        catch (err) {
            console.log(err);
        }
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

    const handlingSetDropdown = () => {
        setShowDropdown(false);
    }

    const handleCloseModal = () => {
        setShowEditModal(false);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        });
    };

    return (
        <div className="post">
            {showDetail && (
                <DetailPost
                    post={post} 
                    userAvatar={post.authorAvatarUrl} 
                    userName={post.authorName}
                    handlingShow={handlingShow}
                    isAuthor={isAuthor}
                />
            )}

            {showEditModal && 
                <EditPostModal
                    handleCloseModal={handleCloseModal} 
                    userInfo={userProfile} 
                    editPost={post}
                    isEditMode={true} />}

            <div className="post__header">
                <div className="post__user" onClick={handlingOpenProfile}>
                    <img
                        src={post.authorAvatarUrl}
                        alt={post.authorAvatarUrl}
                        className="post__user-avatar"
                        onClick={handlingOpenProfile}
                    />
                    <div className="post__user-info">
                        <span className="post__username">{post.authorName}</span>
                        <span 
                            className="post__time-ago">
                                {formatDate(post.createdTime)} 
                                {post.createdTime !== post.updatedTime && `(lastUpdate:${formatDate(post.updatedTime)})` }
                            </span>
                    </div>
                </div>
                <MoreHorizontal 
                    size={20} 
                    className="post__options" 
                    onClick={() => setShowDropdown(!showDropdown)}
                />

                {showDropdown && 
                    <DropdownMenu 
                        isAuthor={isAuthor} 
                        handleEditPost={handleEditPost} 
                        handleDeletePost={handleDeletePost} 
                        handlingSetDropdown={handlingSetDropdown}
                    />}
            </div>

            <div className="post-container">
                <div className="post__content"> 
                    <span>{post.content}</span>
                </div>

                {post.postMedia && post.postMedia.length > 0 && (
                    <div className="post__media" onClick={() => setShowDetail(true)}>
                        {post.postMedia.slice(0, 5).map((media, index) => (
                            <div
                            key={index}
                            className={`post__image-wrapper ${
                                index === 4 && post.postMedia.length > 5
                                ? "post__image--more"
                                : ""
                            }`}
                            >
                            <img
                                src={media.url}
                                alt="Post content"
                                className="post__image"
                                onClick={() => setShowDetail(true)}
                            />
                            {index === 4 && post.postMedia.length > 5 && (
                                <div
                                className="post__image-overlay"
                                onClick={() => setShowDetail(true)}
                                >
                                +{post.postMedia.length - 5}
                                </div>
                            )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="post__actions">
                <div className="post__actions-left">
                    <Heart
                        size={24}
                        className={`post__action-icon ${
                        post.liked || isLiked ? "post__action-icon--liked" : ""
                        }`}
                        onClick={handleLikePost}
                    />
                    <MessageCircle size={24} className="post__action-icon" onClick={() => setShowDetail(true)} />
                    <Send size={24} className="post__action-icon" onClick={handlingShare} />
                </div>
                <Bookmark
                    size={24}
                    className={`post__action-icon ${
                        post.saved ? "post__action-icon--saved" : ""
                    }`}
                    onClick={handlingBookmark}
                />
            </div>

            <div className="post__info" onClick={() => setShowDetail(true)}>
                <div className="post__likes">{post.userLikes.length} lượt thích</div>
                <div className="post__cmt">{post.comments.length} comment</div>
            </div>
        </div>
    );
}

export default Post;
