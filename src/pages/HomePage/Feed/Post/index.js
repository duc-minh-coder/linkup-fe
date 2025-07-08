import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal
} from "lucide-react";
import { useState } from "react";
import "./Post.scss";
import DetailPost from "./DetailPost";
import { useNavigate } from "react-router-dom";

function Post({ post, userProfile }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    // const navigate = useNavigate();

    const handlingShow = () => {
        setShowDetail(false);
    }

    const handlingOpenProfile = (e) => {
        e.preventDefault();

        console.log("aaaa")
    }

    const handlingShare = () => {

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
                />
            )}

            <div className="post__header">
                <div className="post__user" onClick={handlingOpenProfile}>
                    <img
                        src={post.authorAvatarUrl}
                        alt={post.authorAvatarUrl}
                        className="post__user-avatar"
                    />
                    <div className="post__user-info">
                        <span className="post__username">{post.authorName}</span>
                        <span className="post__time-ago">{formatDate(post.updatedTime)}</span>
                    </div>
                </div>
                <MoreHorizontal size={20} className="post__options" />
            </div>

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

            <div className="post__actions">
                <div className="post__actions-left">
                    <Heart
                        size={24}
                        className={`post__action-icon ${
                        isLiked ? "post__action-icon--liked" : ""
                        }`}
                        onClick={() => setIsLiked(!isLiked)}
                    />
                    <MessageCircle size={24} className="post__action-icon" onClick={() => setShowDetail(true)} />
                    <Send size={24} className="post__action-icon" onClick={handlingShare} />
                </div>
                <Bookmark
                    size={24}
                    className={`post__action-icon ${
                        isSaved ? "post__action-icon--saved" : ""
                    }`}
                    onClick={() => setIsSaved(!isSaved)}
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
