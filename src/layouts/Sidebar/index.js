import { Heart, MessageCircle, Bookmark, Search, Home, PlusSquare, User, Bell, X } from 'lucide-react';
import "./Sidebar.scss";
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SearchBar from '../../pages/SearchBar';

function Sidebar({ userInfo }) {
    const menuItems = [
        { icon: Home, label: 'Trang chủ', path: "/", mobileTop: false, isHome: true },
        { icon: Search, label: 'Tìm kiếm', path: "/", mobileTop: true, search: true },
        { icon: MessageCircle, label: 'Tin nhắn', path: "messages", mobileTop: false },
        { icon: Bell, label: 'Thông báo', path: "/notifications", mobileTop: true },
        { icon: PlusSquare, label: 'Tạo bài viết', path: "/", mobileTop: false, createPost: true },
        { icon: Bookmark, label: 'Bookmark', path: "/bookmark", mobileTop: false },
        { icon: User, label: 'Trang cá nhân', path: `/profile/${userInfo.id}`, mobileTop: false },
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

    useEffect(() => {
        if (submitBtnRef.current) {
            submitBtnRef.current.disabled = postText.trim() === "";
        }
    }, [postText]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setFileSelectedImages(files);

        const imgURLs = files.map(file => {
            return URL.createObjectURL(file);
        })

        setSelectedImages(prev => [...prev, ...imgURLs]);
    };

    const handleSubmit = async () => {
        // Handle post submission logic here
        console.log("Post submitted:", { text: postText, image: selectedImages });

        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("content", postText);
        fileSelectedImages.map(img => {
            formData.append("mediaList", img)
        })

        try {
            const response = await axios.post("http://localhost:8080/api/posts", 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )

            console.log(response.data);
            setPost(response.data);
        }
        catch(err) {
            console.log(err);
        }
        
        // Reset form
        setPostText("");
        setSelectedImages([]);
        setShowCreatePost(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCloseModal = () => {
        setShowCreatePost(false);
        setPostText("");
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

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
                        className={({ isActive }) => `sidebar__nav-item ${isActive & !item?.createPost & !item?.search ? 'sidebar__nav-item--active' : ''} ${item.mobileTop ? "hidden-mobile" : ""}`}
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
            {showCreatePost && (
                <>
                    <div className="modal-overlay" onClick={handleCloseModal}></div>
                    <div className="post-modal">
                        <div className="post-modal__header">
                            <h2>Tạo bài viết</h2>
                            <button className="post-modal__close" onClick={handleCloseModal}>
                                x
                            </button>
                        </div>

                        <div className="post-modal__user-info">
                            <img src={userInfo.avatarUrl} alt="User avatar" />
                            <div>
                                <div className="post-modal__username">Nguyễn Đức Minh</div>
                                <div className="post-modal__privacy">Bạn bè</div>
                            </div>
                        </div>

                        <div className="post-modal__content">
                            <textarea
                                className="post-modal__textarea"
                                placeholder="Bạn đang nghĩ gì?"
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                rows={3}
                            />

                            {selectedImages.length > 0 && (
                                <div className="post-modal__image-preview-multiple">
                                    {
                                        selectedImages.map((img, index) => (
                                            <div key={index} className="image-wrapper">
                                                <img src={img} alt={`Preview ${index}`} />
                                                <button 
                                                    onClick={() => {
                                                        setSelectedImages(selectedImages.filter((_, i) => i !== index));
                                                    }}
                                                >×</button>
                                            </div>
                                        ))
                                    }
                                    
                                </div>
                            )}
                        </div>

                        <button 
                            className="post-modal__add-media"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            📷 Thêm ảnh/video
                        </button>

                        <input
                            type="file"
                            accept="image/*,video/*"
                            ref={fileInputRef}
                            onChange={handleImageChange} 
                            multiple
                            style={{ display: 'none' }}
                        />

                        <button 
                            className="post-modal__submit"
                            ref={submitBtnRef}
                            onClick={handleSubmit}
                            disabled={postText.trim() === ""}
                        >
                            Đăng
                        </button>
                    </div>
                </>
            )}
            {showSearch && <SearchBar isOpen={showSearch} onClose={() => setShowSearch(false)} />}
        </div>
    );
};

export default Sidebar;