import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Search, Home, Compass, PlusSquare, User, Menu } from 'lucide-react';
import "./Sidebar.scss";
import { NavLink } from 'react-router-dom';

function Sidebar() {

    const menuItems = [
        { icon: Home, label: 'Trang chủ', path: "/" },
        { icon: Search, label: 'Tìm kiếm', path: "/finding" },
        { icon: MessageCircle, label: 'Tin nhắn', path: "messages" },
        { icon: Heart, label: 'Thông báo', path: "/notifications" },
        { icon: PlusSquare, label: 'Tạo bài viết', path: "/create-post" },
        { icon: User, label: 'Trang cá nhân', path: "/my-info" },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <h1 className="sidebar__logo">Link up</h1>
            </div>
            
            <nav className="sidebar__nav">
                {menuItems.map((item, index) => (
                <NavLink 
                    key={index} 
                    to={item.path} 
                    className={({ isActive }) => `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}>

                    <item.icon size={24} />
                    <span className="sidebar__nav-label">{item.label}</span>
                </NavLink>
                ))}
            </nav>
            
            {/* <div className="sidebar__footer">
                <div className="sidebar__nav-item">
                <Menu size={24} />
                <span className="sidebar__nav-label">Xem thêm</span>
                </div>
            </div> */}
        </div>
    );
};

export default Sidebar;