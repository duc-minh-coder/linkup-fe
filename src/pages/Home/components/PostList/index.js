import PostItem from "./PostItem";
import "./PostList.scss";

function PostList({ posts }) {
    if (!posts) {
        return(
            <>
                <div className="empty-state">
                    <div className="container">
                        <div className="empty-content">
                            <h3>Chưa có bài viết nào để hiển thị.</h3>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="post-list">
            {posts.map(post => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostList;