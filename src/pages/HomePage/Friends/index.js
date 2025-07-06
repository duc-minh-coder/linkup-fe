import "./Friends.scss";

function Friends({ userProfile, friends }) {
    return (
        <div className="friends">
            <div className="friends__header">
                <div className="friends__current-user">
                <img src={userProfile.avatarUrl} alt="Current user" />
                <div className="friends__user-info">
                    {/* <span className="friends__username">${userProfile}</span> */}
                    <span className="friends__full-name">{userProfile.fullName}</span>
                </div>
                </div>
                <span className="friends__switch-btn">chuyển</span>
            </div>
            
            <div className="friends__content">
                <div className="friends__title">
                <span>Bạn bè của bạn</span>
                <span className="friends__see-all">Xem tất cả</span>
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

                    <span className="friends__chat-btn">nhắn tin</span>
                    </div>
                ))}
                </div>
            </div>
            
            <div className="friends__footer">
                <div className="friends__links">
                    Giới thiệu · Trợ giúp · Báo chí · API · Việc làm ·
                    Quyền riêng tư · Điều khoản · Vị trí · Ngôn ngữ ·
                    Meta đã xác minh
                </div>
                <div className="friends__copyright">
                © 2025 LINK UP BY MINH
                </div>
            </div>
        </div>
    );
}

export default Friends;