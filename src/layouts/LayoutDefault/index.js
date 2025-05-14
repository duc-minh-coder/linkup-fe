import { Outlet, NavLink } from 'react-router-dom';
import './LayoutDefault.scss';
import searchIcon from "../../assets/icon/search.png";
import logo from "../../assets/images/logo_web.png";
import homeIcon from "../../assets/icon/home.png";
import friendsIcon from "../../assets/icon/friends.png";
import chattingIcon from "../../assets/icon/chatting.png";
import notificationIcon from "../../assets/icon/bell.png";
import avt from "../../assets/images/avtmacdinh.png";
import settingIcon from "../../assets/icon/settings.png";

function LayoutDefault() {
    var isLogin = false;
    
    const navLinkActive = (e) => {
        return e.isActive ? "header__link header__link--active" : "header__link";
    }
    return (
        <>
            <div className="layout-default">
                <header className="header">
                    <div className='header__left'>
                        <div className='header__logo'>
                            <img src={logo} className='header__logo-img'/>
                        </div>

                        <div className="header__search">
                            <div className="header__icon-block">
                                <img src={searchIcon} />
                            </div>

                            <div className="header__input-block">
                                <input className="header__input" type="text" id="search" />
                            </div>
                        </div>
                    </div>
                    
                    <div className='header__right'>
                        <div className="header__menu">
                            <ul>
                                <li>
                                    <NavLink to="/" className={navLinkActive}>
                                        <img src={homeIcon} />

                                        <p>Trang chủ</p>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="friends" className={navLinkActive}>
                                        <img src={friendsIcon} />

                                        <p>Bạn bè</p>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="message" className={navLinkActive}>
                                        <img src={chattingIcon} />

                                        <p>Trò chuyện</p>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="notifications" className={navLinkActive}>
                                        <img src={notificationIcon} />

                                        <p>Thông báo</p>
                                    </NavLink>
                                </li>
                            </ul>    
                        </div>
                    </div>

                    <div className="header__info-block">
                        {
                            isLogin ? 
                            <div className='header__info'>
                                <img src={avt} />

                                <p>Nguyễn Đức Minh</p>
                            </div> :
                            <NavLink to="signin" className="header__signin">đăng nhập</NavLink>
                        }
                        

                        <div className='header__setting'>
                            <img src={settingIcon} />
                        </div>
                    </div>
                </header>

                

                <main className="main">
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default LayoutDefault;