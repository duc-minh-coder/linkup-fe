import axios from "axios";
import { 
    ConfigIcon, 
    CloseIcon,
    LikeIcon,
    CommentIcon,
    ShareIcon
} from "../../../../../components/assetsConvert";
import "./PostItem.scss";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import DetailPost from "./DetailPost";


function PostItem({ post }) {
    const [error, setError] = useState(null);
    const [userLiked, setUserLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.userLikes?.length || 0);
    const [showDetail, setShowDetail] = useState(false);
    const [viewImageUrl, setViewImageUrl] = useState(null);

    // useEffect(() => {
    //     const socketUrl = "http://localhost:8080/ws";

    //     const stompClient = new Client({
    //         webSocketFactory: () => new SockJS(socketUrl),
    //         reconnectDelay: 5000,
    //         onConnect: () => {
    //             stompClient.subscribe(`/topic/post-like/${post.id}`, (message) => {
    //                 const body = JSON.parse(message.body);
    //                 setLikeCount(body.likesCount);
    //             })
    //         },
    //         debug: (str) => console.log(str)
    //     })

    //     stompClient.activate();

    //     return () => stompClient.deactivate();
    // }, [post.id])

    const handleLike = async () => {
        const postId = post.id;

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("không tìm thấy token");
                return;
            }

            const response = await axios.post("http://localhost:8080/api/post-like", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    postId: postId
                }
            })

            console.log(response.data.result);

        }
        catch(err) {
            console.log(err);
        }

        console.log("Liked post:", post.id);
    };

    const handleComment = () => {
        console.log("Comment on post:", post.id);
    };

    const handleShare = () => {
        console.log("Share post:", post.id);
    };

    const handlingShow = () => {
        setShowDetail(false);
    }

    return (
        <article className="post-item">
            {showDetail && (
                <DetailPost 
                        post={post} 
                        showDetail={showDetail} 
                        userAvatar={post.authorAvatarUrl} 
                        userName={post.authorName}
                        handlingShow={handlingShow}
                />
            )}

            {/* Post Header */}
            <div className="post-item__header" onClick={() => setShowDetail(true)}>
                <div className="post-item__user">
                    <img 
                        src={post.authorAvatarUrl} 
                        alt={`${post.author} avatar`}
                        className="post-item__avatar"
                    />
                    <div className="post-item__user-info">
                        <h3 className="post-item__author">{post.authorName}</h3>
                        <time className="post-item__date">{post.updatedTime}</time>
                    </div>
                </div>
                
                <div className="post-item__actions">
                    <button className="post-item__action-btn" title="Tùy chọn">
                        <ConfigIcon className="post-item__config" />
                    </button>
                    
                    <button className="post-item__action-btn" title="Đóng">
                        <CloseIcon className="post-item__close" />
                    </button>
                </div>
            </div>

            {/* Post Content */}
            <div className="post-item__content">
                {post.content && (
                    <p className="post-item__text">{post.content}</p>
                )}

                {post.postMedia && post.postMedia.length > 0 && (
                    <div className="post-item__media">
                            {post.postMedia.slice(0, 5).map((media, index) => (
                                <div 
                                    key={index} 
                                    className={`post-item__image-wrapper ${index === 4 && post.postMedia.length > 5 ? "post-item__image--more" : ""}`}
                                    onClick={() => {
                                        if (index === 4 && post.postMedia.length > 5) {
                                            alert(`Xem thêm ${post.postMedia.length - 5} ảnh`); // bạn có thể thay thành mở modal ở đây
                                        }
                                    }}
                                >
                                    <img 
                                        src={media.url} 
                                        alt="Post content"
                                        className="post-item__image"
                                        onClick={() => setViewImageUrl(media.url)}
                                    />
                                    {
                                        index === 4 && post.postMedia.length > 5 && (
                                            <div className="post-item__image-overlay">
                                                +{post.postMedia.length - 5}
                                            </div>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                    )}
            </div>

            {/* Post Stats */}
            <div className="post-item__stats">
                <span className="post-item__stat">
                    {/* {post.userLikes.length} lượt thích */}
                    {likeCount} lượt thích
                </span>

                <span className="post-item__stat">
                    {post.comments.length} bình luận</span>
            </div>

            {/* Post Interactions */}
            <div className="post-item__interactions">
                <button 
                    className="post-item__interaction-btn"
                    onClick={handleLike}
                >
                    <LikeIcon />
                    <span>Thích</span>
                </button>
                
                <button 
                    className="post-item__interaction-btn"
                    onClick={handleComment}
                >
                    <CommentIcon />
                    <span>Bình luận</span>
                </button>
                
                <button 
                    className="post-item__interaction-btn"
                    onClick={handleShare}
                >
                    <ShareIcon />
                    <span>Chia sẻ</span>
                </button>
            </div>

            {viewImageUrl && (
                <div className="image-viewer-overlay" onClick={() => setViewImageUrl(null)}>
                    <div className="image-viewer-modal" onClick={(e) => e.stopPropagation()}>
                        <img src={viewImageUrl} alt="Zoomed" />
                    </div>
                </div>
            )}
        </article>
    );
}

export default PostItem;