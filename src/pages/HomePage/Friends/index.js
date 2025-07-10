import { useNavigate } from "react-router-dom";
import "./Friends.scss";

function Friends({ userProfile, friends }) {
    const navigate = useNavigate();

    const handlingShowAllFriend = (e) => {
        e.preventDefault();

        navigate("/friends");
    }

    return (
        <div className="friends">
            <div className="friends__header" onClick={() => navigate(`/profile/${userProfile.id}`)}>
                <div className="friends__current-user">
                    <img src={userProfile.avatarUrl} alt="Current user" />
                    <div className="friends__user-info">
                        <span className="friends__full-name">{userProfile.fullName}</span>
                    </div>
                </div>
                <span className="friends__switch-btn">chuyển</span>
            </div>
            
            <div className="friends__content">
                <div className="friends__title">
                    <span>Bạn bè của bạn</span>
                    <button className="friends__see-all" onClick={handlingShowAllFriend}>Xem tất cả</button>
                </div>
                
                <div className="friends__list">
                {friends.map((friend, index) => (
                    <div key={index} className="friends__item">
                    <div className="friends__user">
                        <img src={friend.avatarUrl} alt="friend avt" />
                        <div className="friends__user-info">
                            <span className="friends__username">{friend.fullName}</span>
                            <span className="friends__description">đang hoạt động</span>
                        </div>
                    </div>

                    <span className="friends__chat-btn" onClick={() => {navigate(`/messages/${friend.id}`)}}>nhắn tin</span>
                    </div>
                ))}
                </div>
            </div>
            
            <div className="friends__footer">
                <div className="friends__links">
                    Giới thiệu · Trợ giúp · API · 
                    Quyền riêng tư · Điều khoản · Ngôn ngữ 
                </div>
                <div className="friends__copyright">
                © 2025 LINK UP BY MINH
                </div>
            </div>
        </div>
    );
}

export default Friends;