import Post from "./Post";
import Stories from "./Stories";
import "./Feed.scss";

function Feed() {
  const posts = [
    {
      username: 'nuutringuyenn',
      avatar: '/api/placeholder/32/32',
      image: '/api/placeholder/600/400',
      likes: '2.011',
      timeAgo: '2 ngày'
    },
    {
      username: 'travel_blogger',
      avatar: '/api/placeholder/32/32',
      image: '/api/placeholder/600/400',
      likes: '1.234',
      timeAgo: '1 ngày'
    }
  ];

  return (
    <div className="feed">
      <Stories />
      <div className="feed__posts">
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;