import PostItem from "./PostItem";
import "./PostList.scss";

function PostList({ posts }) {
    return (
        <div className="post-list">
            {posts.map(post => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostList;