import "./Story.scss";

function Story({ username, avatar, isOwn = false }) {
    return (
        <div className="story">
            <div className={`story__avatar ${isOwn ? 'story__avatar--own' : ''}`}>
                <img src={avatar} alt={username} />
                {isOwn && <div className="story__add-btn">+</div>}
            </div>

            <span className="story__username">{username}</span>
        </div>
    );
}

export default Story;