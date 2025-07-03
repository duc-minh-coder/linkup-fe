import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Search, Home, Compass, PlusSquare, User, Menu } from 'lucide-react';
import "./Sidebar.scss";

function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Trang chủ', active: true },
    { icon: Search, label: 'Tìm kiếm' },
    // { icon: PlusSquare, label: 'Reels' },
    { icon: MessageCircle, label: 'Tin nhắn' },
    { icon: Heart, label: 'Thông báo' },
    { icon: PlusSquare, label: 'Tạo bài viết' },
    { icon: User, label: 'Trang cá nhân' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h1 className="sidebar__logo">Link up</h1>
      </div>
      
      <nav className="sidebar__nav">
        {menuItems.map((item, index) => (
          <div key={index} className={`sidebar__nav-item ${item.active ? 'sidebar__nav-item--active' : ''}`}>
            <item.icon size={24} />
            <span className="sidebar__nav-label">{item.label}</span>
          </div>
        ))}
      </nav>
      
      <div className="sidebar__footer">
        <div className="sidebar__nav-item">
          <Menu size={24} />
          <span className="sidebar__nav-label">Xem thêm</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;