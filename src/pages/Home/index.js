import "./Home.scss";
import avt from "../../assets/images/avtmacdinh.png";
import imgFake from "../../assets/images/kcotime.jpg";
import { 
    LiveIcon,
    VideoIcon,
    ConfigIcon, 
    CloseIcon,
    LikeIcon,
    CommentIcon,
    ShareIcon,
    FriendIcon,
    SavedIcon,
    GroupIcon,
    VidIcon,
    ChatIcon,
    GameIcon,
    PostSavedIcon,
    ChatBotIcon,
    SearchIcon,
    CallIcon,
    VideoCallIcon 
} from "../../components/assetsConvert.js";
import { useEffect, useState, useRef } from "react";

function Home() {
    // Sample post data
    const posts = [
        {
        id: 1,
        author: "Nguyễn Đức Minh",
        avatar: avt,
        date: "13/8/2005 04:04",
        content: "Happy birthday!",
        image: imgFake,
        likes: 1975,
        comments: 99
        },
        {
        id: 2,
        author: "Nguyễn Đức Minh",
        avatar: avt,
        date: "30/02/2025 04:04",
        content: "hello world",
        image: null,
        likes: 1,
        comments: 0
        },
        {
        id: 3,
        author: "Nguyễn Đức Minh",
        avatar: avt,
        date: "13/8/2005 04:04",
        content: "Happy birthday!",
        image: imgFake,
        likes: 1975,
        comments: 99
        }
    ];

    // Active friends data
    const activeFriends = [
        { id: 1, name: "Nguyễn Đức Minh", avatar: avt },
        { id: 2, name: "Nguyễn Đức Minh", avatar: avt },
        { id: 3, name: "Nguyễn Đức Minh", avatar: avt },
        { id: 4, name: "Nguyễn Đức Minh", avatar: avt },
        { id: 5, name: "Nguyễn Đức Minh", avatar: avt }
    ];

    const [showMore, setShowMore] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [text, setText] = useState("");

    const submitBtnRef = useRef(null);

    const showMes = () => {
        setShowMessage(true);
    }

    const closeMes = () => {
        setShowMessage(false);
    }
    
    const handlingPost = () => {
        setShowPost(true);
    }

    useEffect(() => {
        if (submitBtnRef.current) {
            submitBtnRef.current.disabled = text.trim() === "";
        }
    }, [text])

    const [image, setImage] = useState(null);
    const fileInputRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="main">
            <sidebar1 className="sidebar1">
                <div className="sidebar1__content">
                    <div className="sidebar1__info">
                        <div className="sidebar1__img--icon">
                            <img src={avt} />
                        </div>

                        <div className="sidebar1__name">
                            <p>Nguyễn Đức Minh</p>
                        </div>
                    </div>

                    <div className="sidebar1__friend">
                        <div className="sidebar1__img">
                            <FriendIcon />
                        </div>

                        <div className="sidebar1__name">
                            <p>Bạn bè</p>
                        </div>
                    </div>

                    <div className="sidebar1__saved">
                        <div className="sidebar1__img">
                            <SavedIcon />
                        </div>

                        <div className="sidebar1__name">
                            <p>Đã lưu</p>
                        </div>
                    </div>

                    <div className="sidebar1__group">
                        <div className="sidebar1__img">
                            <GroupIcon />
                        </div>

                        <div className="sidebar1__name">
                            <p>Nhóm của tôi</p>
                        </div>
                    </div>
                    {
                        showMore && 
                        <>
                            <div className="sidebar1__video">
                                <div className="sidebar1__img">
                                    <VidIcon />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Video</p>
                                </div>
                            </div>

                            <div className="sidebar1__message">
                                <div className="sidebar1__img">
                                    <ChatIcon />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Tin nhắn</p>
                                </div>
                            </div>

                            <div className="sidebar1__game">
                                <div className="sidebar1__img">
                                    <GameIcon />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Trò chơi</p>
                                </div>
                            </div>

                            <div className="sidebar1__post-saved">
                                <div className="sidebar1__img">
                                    <PostSavedIcon />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Trang đã lưu</p>
                                </div>
                            </div>

                            <div className="sidebar1__chat-bot">
                                <div className="sidebar1__img">
                                    <ChatBotIcon />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Chat bot AI</p>
                                </div>
                            </div>
                        </>
                    }

                    {/* Nút bấm */}
                    <div className="sidebar1__toggle" onClick={() => setShowMore(!showMore)}>
                        <p>{showMore ? "Ẩn bớt" : "Xem thêm"}</p>
                    </div>

                    <div className='sidebar1__contact'>
                        <p>Facebook: <a href="https://www.facebook.com/nguyen.uc.minh.396857">MinhZom</a></p>
                        <p>LinkedIn: <a href='https://www.linkedin.com/in/đức-minh-nguyễn-a4723531b/'>MinhZom</a></p>
                    </div>

                    <div className='sidebar1__by'>
                        <p>Copyright @2025 by MinhZom</p>
                    </div>
                </div>
            </sidebar1>

            <div className="home">
                <div className="home__post">
                    <div className="home__up-post">
                        <div className="home__img-block">
                            <img src={avt} className="home__info-img"/> 
                        </div>
                        
                        <span className="home__post-content" onClick={handlingPost}>
                            <p className="home__text">bạn đang nghĩ gì?</p>
                        </span>
                    </div>

                    <div className="home__type">
                        <div className="home__live">
                            <LiveIcon />

                            <p>trực tiếp</p>
                        </div>

                        <div className="home__video" onClick={handlingPost}>
                            <VideoIcon />

                            <p>ảnh/video</p>
                        </div>
                    </div>
                </div>

                {/* khi trang up post đc bật */}
                {
                    showPost &&
                    <>
                    <div className="post__bgr" onClick={() => {setShowPost(false)}}></div>

                        <div className="post__box">
                            <div className="post__top">
                                <div className="post__title"><h2>Tạo bài viết</h2></div>

                                <div className="post__out" onClick={() => {setShowPost(false)}}>
                                    <img src={CloseIcon} />
                                </div>
                            </div>

                            <div className="post__content">
                                <div className="post__avatar">
                                    <img src={avt} />
                                </div>
                                <div className="post__user-details">
                                    <span className="post__username">Nguyễn Đức Minh</span>
                                    <span className="post__privacy">Bạn bè</span>
                                </div>
                            </div>
                            <div className="post__scrollable">
                                <div className="post__input">
                                    <textarea 
                                    className="post__input-box" 
                                    rows="4"   
                                    placeholder="Bạn đang nghĩ gì thế?" 
                                    onChange={(e) => {setText(e.target.value)}}
                                    />
                                </div>

                                {image && (
                                    <div className="post__preview">
                                        <img src={image} alt="preview" className="post__preview-img" />

                                        <button className="post__remove-media" onClick={() => {
                                            setImage(null);
                                            fileInputRef.current.value = "";
                                        }}>
                                            x
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button 
                                className="post__image-upload" 
                                onClick={() => fileInputRef.current.click()}
                            >
                                Thêm ảnh
                            </button>
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                style={{ display: 'none' }}
                            />

                            <button className="post__submit" ref={submitBtnRef}>Đăng</button>
                        </div>
                    </>
                }
                {/* ds bài viết */}
                <div className="home__news">
                    {posts.map(post => (
                            <div className="home__content">
                                {/* top */}
                                <div className="home__top">
                                    <div className="home__user">
                                        <img src={post.avatar} />

                                        <div className="home__user-block">
                                            <p>{post.author}</p>
                                            <span>{post.date}</span>
                                        </div>
                                        
                                    </div>

                                    <div className="home__choice">
                                        <ConfigIcon />

                                        <CloseIcon />
                                    </div>
                                </div>

                                {/* content block */}
                                <div className="home__content-block">
                                    <p>{post.content}</p>

                                    <img src={post.image} />
                                </div>

                                {/* react */}
                                <div className="home__react">
                                    <div className="home__like">
                                        <p>{post.likes} likes</p>
                                    </div>
                            
                                    <div className="home__comment">
                                        <p>{post.comments} comments</p>
                                    </div>
                                </div>

                                <div className="line"></div>

                                <div className="home__react-btn">
                                    <div className="home__react-btn--content">
                                        <LikeIcon />

                                        <p>like</p>
                                    </div>

                                    <div className="home__react-btn--content">
                                        <CommentIcon />

                                        <p>comment</p>
                                    </div>

                                    <div className="home__react-btn--content">
                                        <ShareIcon />

                                        <p>share</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <sidebar2 className="sidebar2">
                <div className="sidebar2__content">
                    <div className="sidebar2__top">
                        <div className="sidebar2__title">
                            <p>Bạn bè đang hoạt động</p>
                        </div>

                        <div className="sidebar2__search">
                            <SearchIcon />
                        </div>
                    </div>
                    
                    <div className="sidebar2__friends">
                        {
                            activeFriends.map(activeFriend => (
                                <div className="sidebar2__info" onClick={showMes}>
                                    <div className="sidebar2__img--icon">
                                        <img src={activeFriend.avatar} />
                                    </div>

                                    <div className="sidebar2__name">
                                        <p>{activeFriend.name}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </sidebar2>
            {showMessage && (
                <div className="message">
                <div className="message__top">
                    <div className="message__left">
                    <div className="message__img">
                        <img src={avt} alt="User Avatar" />
                    </div>

                    <div className="message__title">
                        <div className="message__name">Nguyễn Đức Minh</div>
                        <div className="message__active">đang hoạt động</div>
                    </div>
                    </div>
                    
                    <div className="message__right">
                    <div className="message__call">
                        <img src=""/>
                    </div>

                    <div className="message__video-call">
                        <VideoCallIcon />
                    </div>

                    <div className="message__out" onClick={closeMes}>
                        <CloseIcon />
                    </div>
                    </div>
                </div>

                <div className="message__content">
                    {/* Placeholder for message content */}
                    {Array(15).fill(0).map((_, i) => (
                    <div key={i} className="message__placeholder">Message {i+1}</div>
                    ))}
                </div>
                </div>
            )}
        </div>
    )
}

export default Home;