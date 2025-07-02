import { useState } from "react";
import "./ProfileInfo.scss";

function ProfileInfo({ userInfo, isOwnProfile = false }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="profile-info">
      <div className="container">
        <div className="profile-content">
          <div className="profile-avatar">
            <img src={userInfo.avatarUrl} alt="Profile" />
          </div>
          <div className="profile-details">
            <div className="profile-header-info">
              <h2>{userInfo.fullName}</h2>
              <div className="profile-actions">
                {/* Chỉ hiển thị nút theo dõi và nhắn tin khi KHÔNG phải profile của mình */}
                {!isOwnProfile && (
                  <>
                    <button
                      className={`follow-btn ${isFollowing ? 'following' : ''}`}
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                    </button>
                    <button className="message-btn">Nhắn tin</button>
                  </>
                )}
                
                {/* Nút chỉnh sửa profile cho chính mình */}
                {isOwnProfile && (
                  <button className="edit-profile-btn">Chỉnh sửa trang cá nhân</button>
                )}
                
                <button className="more-btn">⋯</button>
              </div>
            </div>
            <div className="profile-stats">
              <span><strong>{userInfo.countPost}</strong> bài viết</span>
              <span><strong>{userInfo.countFriend}</strong> bạn bè</span>
            </div>
            <div className="profile-bio">
              <p>{userInfo.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;