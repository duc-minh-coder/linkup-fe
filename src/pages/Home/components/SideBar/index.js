import "./Sidebar.scss";
import { useState } from "react";
import { 
    FriendIcon,
    SavedIcon,
    GroupIcon,
    VidIcon,
    ChatIcon,
    GameIcon,
    PostSavedIcon,
    ChatBotIcon
} from "../../../../components/assetsConvert.js";

function Sidebar({ userAvatar, userName }) {
    const [showMore, setShowMore] = useState(false);

    const menuItems = [
        { icon: <FriendIcon />, label: "Bạn bè", isMain: true },
        { icon: <SavedIcon />, label: "Đã lưu", isMain: true },
        { icon: <GroupIcon />, label: "Nhóm", isMain: true },
        { icon: <VidIcon />, label: "Video", isMain: true },
        { icon: <ChatIcon />, label: "Tin nhắn", isMain: true },
        { icon: <GameIcon />, label: "Trò chơi", isMain: false },
        { icon: <PostSavedIcon />, label: "Trang đã lưu", isMain: false },
        { icon: <ChatBotIcon />, label: "Chat bot AI", isMain: false },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar__content">
                {/* User Info */}
                <div className="sidebar__user">
                    {(userAvatar) && <img src={userAvatar} alt="User avatar" className="sidebar__avatar" />}
                    
                    <span className="sidebar__username">{userName}</span>
                </div>

                {/* Menu Items */}
                <nav className="sidebar__menu">
                    {menuItems
                        .filter(item => item.isMain || showMore)
                        .map((item, index) => (
                                <div key={index} className="sidebar__menu-item">
                                    <div className="sidebar__icon">{item.icon}</div>
                                    <span className="sidebar__label">{item.label}</span>
                                </div>
                    ))}
                </nav>

                {/* Toggle Button */}
                <button 
                    className="sidebar__toggle"
                    onClick={() => setShowMore(!showMore)}
                >
                    {showMore ? "Thu gọn" : "Xem thêm"}
                </button>

                {/* Footer */}
                <div className="sidebar__footer">
                    <div className="sidebar__contact">
                        <a href="https://www.facebook.com/nguyen.uc.minh.396857">Facebook</a>
                        <a href="https://www.linkedin.com/in/đức-minh-nguyễn-a4723531b/">LinkedIn</a>
                    </div>
                    <div className="sidebar__copyright">
                        © 2025 MinhZom
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;