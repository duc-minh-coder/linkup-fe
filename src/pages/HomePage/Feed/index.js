import Post from "./Post";
import Stories from "./Stories";
import "./Feed.scss";

function Feed({ posts, userProfile }) {
    return (
        <div className="feed">
            <div className="feed__posts">
                {posts.map((post, index) => (
                    <Post key={index} post={post} userProfile={userProfile} />
                ))}
            </div>
        </div>
    );
}

export default Feed;
