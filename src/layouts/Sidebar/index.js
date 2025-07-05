import { Heart, MessageCircle, Bookmark, Search, Home, PlusSquare, User, Bell } from 'lucide-react';
import "./Sidebar.scss";
import { NavLink, useLocation } from 'react-router-dom';

function Sidebar({ userInfo }) {
    const menuItems = [
        { icon: Home, label: 'Trang chủ', path: "/", mobileTop: false },
        { icon: Search, label: 'Tìm kiếm', path: "/finding", mobileTop: true },
        { icon: MessageCircle, label: 'Tin nhắn', path: "messages", mobileTop: false },
        { icon: Bell, label: 'Thông báo', path: "/notifications", mobileTop: true },
        { icon: PlusSquare, label: 'Tạo bài viết', path: "/create-post", mobileTop: false },
        { icon: Bookmark, label: 'Bookmark', path: "/bookmark", mobileTop: false },
        { icon: User, label: 'Trang cá nhân', path: `/profile/${userInfo.id}`, mobileTop: false },
    ];

    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="sidebar">
            <NavLink to="/" className="sidebar__logo">Link up</NavLink>

            {
                isHome && 
                    <div className="sidebar__header">
                        <NavLink to="/" className="sidebar__logo-mb">Link up</NavLink>

                        {
                            <div className='sidebar__mobile-function'>
                                {menuItems.map((item, index) => (item.mobileTop) && (
                                    <NavLink 
                                        key={index} 
                                        to={item.path} 
                                        className={({ isActive }) => `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
                                    >
                                        <item.icon size={24} />
                                        <span className="sidebar__nav-label">{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>  
                        }     
                    </div>
            }

            
            <nav className="sidebar__nav">
                {menuItems.map((item, index) => (
                    <NavLink 
                        key={index} 
                        to={item.path} 
                        className={({ isActive }) => `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''} ${item.mobileTop ? "hidden-mobile" : ""}`}
                    >
                        <item.icon size={24} />
                        <span className="sidebar__nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;