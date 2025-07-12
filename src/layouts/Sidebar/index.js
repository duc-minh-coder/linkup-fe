import { Heart, MessageCircle, Bookmark, Search, Home, PlusSquare, User, Bell, Menu, icons, Users } from 'lucide-react';
import "./Sidebar.scss";
import { NavLink, useLocation } from 'react-router-dom';
import { lazy, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SearchBar from '../../pages/SearchBar';
import CreatePost from '../../pages/CreatePost';
import BookmarkPage from '../../pages/BookmarkPage';

function Sidebar({ userInfo }) {
    const menuItems = [
        { icon: Home, label: 'Trang chủ', path: "/", mobileTop: false, isHome: true },
        { icon: Search, label: 'Tìm kiếm', path: "/", mobileTop: true, search: true },
        { icon: MessageCircle, label: 'Tin nhắn', path: "messages", mobileTop: false },
        { icon: Bell, label: 'Thông báo', path: "/notifications", mobileTop: true },
        { icon: PlusSquare, label: 'Tạo bài viết', path: "/", mobileTop: false, createPost: true },
        { icon: Bookmark, label: 'Bookmark', path: "/bookmark", menu: true },
        { icon: User, label: 'Trang cá nhân', path: `/profile/${userInfo.id}`, mobileTop: false },
        { icon: Menu , label: 'Chức năng khác', path: null, mobileTop: false, isMenu: true },
    ];

    const menuOtherFunction = [
        { icon: Bookmark, label: 'Bookmark', path: '/bookmark' },
        { icon: Users, label: 'Bạn bè', path: '/friends' },

    ];

    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const location = useLocation();
    const isHome = location.pathname === "/";

    const [postText, setPostText] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const fileInputRef = useRef();
    const submitBtnRef = useRef();

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
        <div className={`sidebar ${(showSearch || showMenu) ? "sidebar--shrink" : ""}`}>
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

                                            else if (item?.isMenu) 
                                                setShowMenu(!showMenu);

                                            if (showSearch && !item?.isHome) {
                                                setShowSearch(false);
                                            }

                                            if (showMenu && !item?.isMenu) {
                                                setShowMenu(false);
                                            }
                                        }}
                                    >
                                        <item.icon size={24} />
                                    </NavLink>
                                ))}
                            </div>  
                        }     
                    </div>
            }

            
            <nav className="sidebar__nav">
                {menuItems.map((item, index) => (
                    !item?.menu &&
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

                                else if (item?.isMenu) 
                                    setShowMenu(!showMenu);

                                if (showSearch && !item?.isHome) {
                                    setShowSearch(false);
                                }

                                if (showMenu && !item?.isMenu) {
                                    setShowMenu(false);
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
            {showSearch && <SearchBar isOpen={showSearch} onClose={() => {setShowSearch(false)}} />}
            {showMenu && (
                <div className='menu-function'>
                    <div className='menu-overlay' onClick={() => setShowMenu(false)}></div>
                    <div className='menu-container'>
                        {
                            menuOtherFunction.map((item, index) => 
                                <NavLink 
                                    key={index}
                                    to={item.path}
                                    className={({ isActive }) => 
                                        `menu-container__item
                                        ${isActive ? 'menu-container__item--active' : ''} `}
                                    onClick={() => setShowMenu(false)}
                                >   
                                    <item.icon size={24} />
                                    <span 
                                        className={`menu-container__label ${showSearch ? "hidden" : ""}`}
                                    >
                                        {item.label}
                                    </span>
                                </NavLink>
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;