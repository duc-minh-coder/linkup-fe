import { useNavigate } from "react-router-dom";
import "./Friends.scss";

function Friends({ userProfile, friends, logout, loadMore, hasMoreFriend }) {
    const navigate = useNavigate();

    const handlingShowAllFriend = (e) => {
        e.preventDefault();

        navigate("/friends");
    }

    return (
        <div className="friends">
            <div className="friends__header">
                <div className="friends__current-user" onClick={() => navigate(`/profile/${userProfile.id}`)}>
                    <img src={userProfile.avatarUrl} alt="Current user" />

                    <div className="friends__user-info">
                        <span className="friends__full-name">{userProfile.fullName}</span>
                    </div>
                </div>
                <span className="friends__switch-btn" onClick={() => logout()}>đăng xuất</span>
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
                                <img src={friend.avatarUrl} alt="friend avt" onClick={() => {navigate(`/profile/${friend.id}`)}}/>
                                <div className="friends__user-info">
                                    <span className="friends__username" onClick={() => {navigate(`/profile/${friend.id}`)}}>{friend.fullName}</span>
                                    <span className="friends__description">đang hoạt động</span>
                                </div>
                            </div>

                            <span 
                                className="friends__chat-btn" 
                                onClick={() => {navigate(`/messages/${friend.id}`)}}
                            >nhắn tin</span>
                        </div>
                    ))}

                    {hasMoreFriend && 
                        <div className="show-more" onClick={() => loadMore()}>xem thêm</div>}
                </div>
            </div>
            
            <div className="friends__footer">
                <div className="friends__links" onClick={() => {navigate('/about')}}>
                    Giới thiệu · Trợ giúp · API · 
                    Quyền riêng tư · Điều khoản · Ngôn ngữ 
                </div>
                <div className="friends__copyright" onClick={() => {navigate('/about')}}>
                © 2025 LINK UP BY MINH
                </div>
            </div>
        </div>
    );
}

export default Friends;