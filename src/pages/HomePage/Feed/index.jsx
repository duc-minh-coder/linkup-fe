import Post from "./Post";
import "./Feed.scss";

function Feed({ posts, userProfile, onlineList }) {
    return (
        <div className="feed">
            <div className="feed__posts">
                {posts && posts.length > 0 
                    ? posts.map((post, index) => (
                        <Post key={index} post={post} userProfile={userProfile} onlineList={onlineList} />
                    ))
                    : <div className="request-add-friend">hãy kết bạn để xem bài viết của họ!</div>}
                {}
            </div>
        </div>
    );
}

export default Feed;
