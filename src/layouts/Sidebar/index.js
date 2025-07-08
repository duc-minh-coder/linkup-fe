import { Heart, MessageCircle, Bookmark, Search, Home, PlusSquare, User, Bell, X, Menu } from 'lucide-react';
import "./Sidebar.scss";
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SearchBar from '../../pages/SearchBar';
import CreatePost from '../../pages/CreatePost';

function Sidebar({ userInfo }) {
    const menuItems = [
        { icon: Home, label: 'Trang chủ', path: "/", mobileTop: false, isHome: true },
        { icon: Search, label: 'Tìm kiếm', path: "/", mobileTop: true, search: true },
        { icon: MessageCircle, label: 'Tin nhắn', path: "messages", mobileTop: false },
        { icon: Bell, label: 'Thông báo', path: "/notifications", mobileTop: true },
        { icon: PlusSquare, label: 'Tạo bài viết', path: "/", mobileTop: false, createPost: true },
        { icon: Bookmark, label: 'Bookmark', path: "/bookmark", mobileTop: false },
        { icon: User, label: 'Trang cá nhân', path: `/profile/${userInfo.id}`, mobileTop: false },
        { icon: Menu , label: 'Chức năng khác', path: `/`, mobileTop: false, isMenu: true },
    ];

    const [showCreatePost, setShowCreatePost] = useState(false);

    const location = useLocation();
    const isHome = location.pathname === "/";

    const [postText, setPostText] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [fileSelectedImages, setFileSelectedImages] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const fileInputRef = useRef();
    const submitBtnRef = useRef();
    const [post, setPost] = useState(null);

    const handleCloseModal = () => {
        setShowCreatePost(false);
        setPostText("");
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        if (submitBtnRef.current) {
            submitBtnRef.current.disabled = postText.trim() === "";
        }
    }, [postText]);


    return (
        <div className={`sidebar ${showSearch ? "sidebar--shrink" : ""}`}>
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
                                        className={({ isActive }) => 
                                            `sidebar__nav-item 
                                            ${isActive & !item?.createPost & !item?.search ? 'sidebar__nav-item--active' : ''}`}
                                            
                                        onClick={() => {
                                            if (item?.createPost) 
                                                setShowCreatePost(!showCreatePost);

                                            else if (item?.search)
                                                setShowSearch(!showSearch);

                                            if (showSearch && !item?.isHome) {
                                                setShowSearch(false);
                                            }
                                        }}
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
                        className={({ isActive }) => 
                            `sidebar__nav-item 
                            ${isActive & !item?.createPost & !item?.search & !item?.isMenu ? 'sidebar__nav-item--active' : ''} 
                            ${item.mobileTop ? "hidden-mobile" : ""}`}

                        onClick={() => {
                            if (item?.createPost) 
                                setShowCreatePost(!showCreatePost);

                            else if (item?.search)
                                setShowSearch(!showSearch);

                            if (showSearch && !item?.isHome) {
                                setShowSearch(false);
                            }
                        }}
                    >
                        <item.icon size={24} />
                        <span className={`sidebar__nav-label ${showSearch ? "hidden" : ""}`}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Modal */}
            {showCreatePost && <CreatePost handleCloseModal={handleCloseModal} userInfo={userInfo} />}
            {showSearch && <SearchBar isOpen={showSearch} onClose={() => setShowSearch(false)} />}
        </div>
    );
};

export default Sidebar;