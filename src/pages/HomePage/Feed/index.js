import Post from "./Post";
import Stories from "./Stories";
import "./Feed.scss";

function Feed({ posts }) {
    return (
        <div className="feed">
            {/* <Stories /> */}

            <div className="feed__posts">
                {posts.map((post, index) => (
                <Post key={index} post={post} />
                ))}
            </div>
        </div>
    );
}

export default Feed;
