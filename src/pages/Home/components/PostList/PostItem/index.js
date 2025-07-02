import axios from "axios";
import { 
    ConfigIcon, 
    CloseIcon,
    LikeIcon,
    CommentIcon,
    ShareIcon,
    LikedIcon

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
                        <time className="post-item__date">{formatDate(post.updatedTime)}</time>
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
                                >
                                    <img 
                                        src={media.url} 
                                        alt="Post content"
                                        className="post-item__image"
                                        onClick={() => setShowDetail(true)}
                                    />
                                    {
                                        index === 4 && post.postMedia.length > 5 && (
                                            <div className="post-item__image-overlay" onClick={() => setShowDetail(true)}>
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
                    {likeCount} lượt thích
                </span>

                <span className="post-item__stat">
                    {post.comments.length} bình luận
                </span>
            </div>

            {/* Post Interactions */}
            <div className="post-item__interactions">
                <button 
                    className={`post-item__interaction-btn ${post.liked ? "liked" : ""}`}
                    onClick={handleLike}
                >
                    
                    {post.liked ? <LikedIcon/> : < LikeIcon/>}
                    <span>thích</span>
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
        </article>
    );
}

export default PostItem;