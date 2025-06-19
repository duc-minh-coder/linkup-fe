import { 
    ConfigIcon, 
    CloseIcon,
    LikeIcon,
    CommentIcon,
    ShareIcon
} from "../../../../../components/assetsConvert";
import "./PostItem.scss";

function PostItem({ post }) {
    const handleLike = () => {
        console.log("Liked post:", post.id);
    };

    const handleComment = () => {
        console.log("Comment on post:", post.id);
    };

    const handleShare = () => {
        console.log("Share post:", post.id);
    };

    return (
        <article className="post-item">
            {/* Post Header */}
            <div className="post-item__header">
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
                {/* {post.postMedia && (
                    <div className="post-item__media">
                        {
                            post.postMedia.map((media, index) => (
                                <img 
                                    src={media.url} 
                                    alt="Post content"
                                    className="post-item__image"
                                    key={index}
                                />                            
                            ))
                        }

                    </div>
                )} */}

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
                    {post.userLikes.length} lượt thích</span>

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
        </article>
    );
}

export default PostItem;