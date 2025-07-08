import { useState } from "react";
import "./ProfileInfo.scss";
import { NavLink } from "react-router-dom";

function ProfileInfo({ userInfo, isOwner }) {
  const [addFriend, setAddFriend] = useState(false);

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
                        {!isOwner && (
                        <>
                            <button
                                className={`add-friend-btn ${addFriend ? 'is-friend' : ''}`}
                                onClick={() => setAddFriend(!addFriend)}
                            >
                                {addFriend ? 'Bạn bè' : 'Gửi kết bạn'}
                            </button>
                            <button className="message-btn">Nhắn tin</button>
                        </>
                        )}
                        
                        {/* btn chỉnh sửa profile cho mình */}
                        {isOwner && (
                            <button className="edit-profile-btn">Chỉnh sửa trang cá nhân</button>
                        )}
                        
                        <button className="more-btn">⋯</button>
                    </div>
                </div>
                <div className="profile-stats">
                    <span><strong>{userInfo.countPost}</strong> bài viết</span>
                    <NavLink to="/friends" className="profile-stats__text">
                        <strong>{userInfo.countFriend}</strong> bạn bè
                    </NavLink>
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