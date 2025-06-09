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
                        src={post.avatar} 
                        alt={`${post.author} avatar`}
                        className="post-item__avatar"
                    />
                    <div className="post-item__user-info">
                        <h3 className="post-item__author">{post.author}</h3>
                        <time className="post-item__date">{post.date}</time>
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
                {post.image && (
                    <div className="post-item__media">
                        <img 
                            src={post.image} 
                            alt="Post content"
                            className="post-item__image"
                        />
                    </div>
                )}
            </div>

            {/* Post Stats */}
            <div className="post-item__stats">
                <span className="post-item__stat">{post.likes} lượt thích</span>
                <span className="post-item__stat">{post.comments} bình luận</span>
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