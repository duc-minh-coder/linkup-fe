import Story from "./Story";
import "./Stories.scss";

const Stories = () => {
  const stories = [
    { username: 'inmalinh', avatar: '/api/placeholder/60/60', isOwn: true },
    { username: 'ngthao_25', avatar: '/api/placeholder/60/60' },
    { username: 'bibabubu...', avatar: '/api/placeholder/60/60' },
    { username: 'manhuog...', avatar: '/api/placeholder/60/60' },
    { username: 'tiboinshape', avatar: '/api/placeholder/60/60' },
    { username: 'growthwit...', avatar: '/api/placeholder/60/60' },
  ];

  return (
    <div className="stories">
      <div className="stories__container">
        {stories.map((story, index) => (
          <Story key={index} {...story} />
        ))}
      </div>
    </div>
  );
};

export default Stories;