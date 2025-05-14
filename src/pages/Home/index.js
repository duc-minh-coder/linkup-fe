import "./Home.scss";
import avt from "../../assets/images/avtmacdinh.png";
import liveIcon from "../../assets/icon/live.png";
import videoIcon from "../../assets/icon/img-video.png";
import configIcon from "../../assets/icon/config.png";
import closeIcon from "../../assets/icon/close.png";
import imgFake from "../../assets/images/kcotime.jpg";
import likeIcon from "../../assets/icon/like.png";
import commentIcon from "../../assets/icon/comment.png";
import shareIcon from "../../assets/icon/share.png";
import friendIcon from "../../assets/icon/friends.png";
import savedIcon from "../../assets/icon/bookmark.png";
import groupIcon from "../../assets/icon/crowd-of-users.png";
import vidIcon from "../../assets/icon/clapperboard.png";
import chatIcon from "../../assets/icon/chatchit.png";
import gameIcon from "../../assets/icon/game-controller.png";
import postSavedIcon from "../../assets/icon/content.png";
import chatBotIcon from "../../assets/icon/chat-bot.png";
import searchIcon from "../../assets/icon/search.png";
import callIcon from "../../assets/icon/phone-call.png";
import videoCallIcon from "../../assets/icon/video-call.png";
import { useEffect, useState, useRef } from "react";

function Home() {
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
                            <img src={friendIcon} />
                        </div>

                        <div className="sidebar1__name">
                            <p>Bạn bè</p>
                        </div>
                    </div>

                    <div className="sidebar1__saved">
                        <div className="sidebar1__img">
                            <img src={savedIcon} />
                        </div>

                        <div className="sidebar1__name">
                            <p>Đã lưu</p>
                        </div>
                    </div>

                    <div className="sidebar1__group">
                        <div className="sidebar1__img">
                            <img src={groupIcon} />
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
                                    <img src={vidIcon} />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Video</p>
                                </div>
                            </div>

                            <div className="sidebar1__message">
                                <div className="sidebar1__img">
                                    <img src={chatIcon} />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Tin nhắn</p>
                                </div>
                            </div>

                            <div className="sidebar1__game">
                                <div className="sidebar1__img">
                                    <img src={gameIcon} />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Trò chơi</p>
                                </div>
                            </div>

                            <div className="sidebar1__post-saved">
                                <div className="sidebar1__img">
                                    <img src={postSavedIcon} />
                                </div>

                                <div className="sidebar1__name">
                                    <p>Trang đã lưu</p>
                                </div>
                            </div>

                            <div className="sidebar1__chat-bot">
                                <div className="sidebar1__img">
                                    <img src={chatBotIcon} />
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
                            <img src={liveIcon} />

                            <p>trực tiếp</p>
                        </div>

                        <div className="home__video" onClick={handlingPost}>
                            <img src={videoIcon} />

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
                                    <img src={closeIcon} />
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

                <div className="home__news">
                    <div className="home__content">
                        {/* top */}
                        <div className="home__top">
                            <div className="home__user">
                                <img src={avt} />

                                <div className="home__user-block">
                                    <p>Nguyễn Đức Minh</p>
                                    <span>13/8/2005 04:04</span>
                                </div>
                                
                            </div>

                            <div className="home__choice">
                                <img src={configIcon} />

                                <img src={closeIcon} />
                            </div>
                        </div>

                        {/* content block */}
                        <div className="home__content-block">
                            <p>Happy birthday!</p>

                            <img src={imgFake} />
                        </div>

                        {/* react */}
                        <div className="home__react">
                            <div className="home__like">
                                <p>1975 likes</p>
                            </div>
                    
                            <div className="home__comment">
                                <p>99 comments</p>
                            </div>
                        </div>

                        <div className="line"></div>

                        <div className="home__react-btn">
                            <div className="home__react-btn--content">
                                <img src={likeIcon} />

                                <p>like</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={commentIcon} />

                                <p>comment</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={shareIcon} />

                                <p>share</p>
                            </div>
                        </div>
                    </div>

                    <div className="home__content">
                        {/* top */}
                        <div className="home__top">
                            <div className="home__user">
                                <img src={avt} />

                                <div className="home__user-block">
                                    <p>Nguyễn Đức Minh</p>
                                    <span>13/8/2005 04:04</span>
                                </div>
                                
                            </div>

                            <div className="home__choice">
                                <img src={configIcon} />

                                <img src={closeIcon} />
                            </div>
                        </div>

                        {/* content block */}
                        <div className="home__content-block">
                            <p>Happy birthday!</p>

                            <img src={imgFake} />
                        </div>

                        {/* react */}
                        <div className="home__react">
                            <div className="home__like">
                                <p>1975 likes</p>
                            </div>
                    
                            <div className="home__comment">
                                <p>99 comments</p>
                            </div>
                        </div>

                        <div className="line"></div>

                        <div className="home__react-btn">
                            <div className="home__react-btn--content">
                                <img src={likeIcon} />

                                <p>like</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={commentIcon} />

                                <p>comment</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={shareIcon} />

                                <p>share</p>
                            </div>
                        </div>
                    </div>

                    <div className="home__content">
                        {/* top */}
                        <div className="home__top">
                            <div className="home__user">
                                <img src={avt} />

                                <div className="home__user-block">
                                    <p>Nguyễn Đức Minh</p>
                                    <span>13/8/2005 04:04</span>
                                </div>
                                
                            </div>

                            <div className="home__choice">
                                <img src={configIcon} />

                                <img src={closeIcon} />
                            </div>
                        </div>

                        {/* content block */}
                        <div className="home__content-block">
                            <p>Happy birthday!</p>

                            <img src={imgFake} />
                        </div>

                        {/* react */}
                        <div className="home__react">
                            <div className="home__like">
                                <p>1975 likes</p>
                            </div>
                    
                            <div className="home__comment">
                                <p>99 comments</p>
                            </div>
                        </div>

                        <div className="line"></div>

                        <div className="home__react-btn">
                            <div className="home__react-btn--content">
                                <img src={likeIcon} />

                                <p>like</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={commentIcon} />

                                <p>comment</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={shareIcon} />

                                <p>share</p>
                            </div>
                        </div>
                    </div>

                    <div className="home__content">
                        {/* top */}
                        <div className="home__top">
                            <div className="home__user">
                                <img src={avt} />

                                <div className="home__user-block">
                                    <p>Nguyễn Đức Minh</p>
                                    <span>13/8/2005 04:04</span>
                                </div>
                                
                            </div>

                            <div className="home__choice">
                                <img src={configIcon} />

                                <img src={closeIcon} />
                            </div>
                        </div>

                        {/* content block */}
                        <div className="home__content-block">
                            <p>Happy birthday!</p>

                            <img src={imgFake} />
                        </div>

                        {/* react */}
                        <div className="home__react">
                            <div className="home__like">
                                <p>1975 likes</p>
                            </div>
                    
                            <div className="home__comment">
                                <p>99 comments</p>
                            </div>
                        </div>

                        <div className="line"></div>

                        <div className="home__react-btn">
                            <div className="home__react-btn--content">
                                <img src={likeIcon} />

                                <p>like</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={commentIcon} />

                                <p>comment</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={shareIcon} />

                                <p>share</p>
                            </div>
                        </div>
                    </div>

                    <div className="home__content">
                        {/* top */}
                        <div className="home__top">
                            <div className="home__user">
                                <img src={avt} />

                                <div className="home__user-block">
                                    <p>Nguyễn Đức Minh</p>
                                    <span>13/8/2005 04:04</span>
                                </div>
                                
                            </div>

                            <div className="home__choice">
                                <img src={configIcon} />

                                <img src={closeIcon} />
                            </div>
                        </div>

                        {/* content block */}
                        <div className="home__content-block">
                            <p>Happy birthday!</p>

                            <img src={imgFake} />
                        </div>

                        {/* react */}
                        <div className="home__react">
                            <div className="home__like">
                                <p>1975 likes</p>
                            </div>
                    
                            <div className="home__comment">
                                <p>99 comments</p>
                            </div>
                        </div>

                        <div className="line"></div>

                        <div className="home__react-btn">
                            <div className="home__react-btn--content">
                                <img src={likeIcon} />

                                <p>like</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={commentIcon} />

                                <p>comment</p>
                            </div>

                            <div className="home__react-btn--content">
                                <img src={shareIcon} />

                                <p>share</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <sidebar2 className="sidebar2">
                <div className="sidebar2__content">
                    <div className="sidebar2__top">
                        <div className="sidebar2__title">
                            <p>Bạn bè đang hoạt động</p>
                        </div>

                        <div className="sidebar2__search">
                            <img src={searchIcon} />
                        </div>
                    </div>
                    
                    <div className="sidebar2__friends">
                        <div className="sidebar2__info" onClick={showMes}>
                            <div className="sidebar2__img--icon">
                                <img src={avt} />
                            </div>

                            <div className="sidebar2__name">
                                <p>Nguyễn Đức Minh</p>
                            </div>
                        </div>

                        <div className="sidebar2__info" onClick={showMes}>
                            <div className="sidebar2__img--icon">
                                <img src={avt} />
                            </div>

                            <div className="sidebar2__name">
                                <p>Nguyễn Đức Minh</p>
                            </div>
                        </div>

                        <div className="sidebar2__info" onClick={showMes}>
                            <div className="sidebar2__img--icon">
                                <img src={avt} />
                            </div>

                            <div className="sidebar2__name">
                                <p>Nguyễn Đức Minh</p>
                            </div>
                        </div>

                        <div className="sidebar2__info" onClick={showMes}>
                            <div className="sidebar2__img--icon">
                                <img src={avt} />
                            </div>

                            <div className="sidebar2__name">
                                <p>Nguyễn Đức Minh</p>
                            </div>
                        </div>

                        <div className="sidebar2__info" onClick={showMes}>
                            <div className="sidebar2__img--icon">
                                <img src={avt} />
                            </div>

                            <div className="sidebar2__name">
                                <p>Nguyễn Đức Minh</p>
                            </div>
                        </div>
                    </div>
                </div>
            </sidebar2>
            {
                showMessage && 
                <div className="message" >
                    <div className="message__top">
                        <div className="message__left">
                            <div className="message__img">
                                <img src={avt} />
                            </div>

                            <div className="message__title">
                                <div className="message__name">Nguyễn Đức Minh</div>

                                <div className="message__active">đang hoạt động</div>
                            </div>
                        </div>
                        
                        <div className="message__right">
                            <div className="message__call">
                                <img src={callIcon} />
                            </div>

                            <div className="message__video-call">
                                <img src={videoCallIcon} />
                            </div>

                            <div className="message__out" onClick={closeMes}>
                                <img src={closeIcon} />  
                            </div>
                        </div>
                    </div>

                    <div className="message__content">
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                        <div>a</div>
                    </div>
                </div>

            }
        </div>
    )
}

export default Home;