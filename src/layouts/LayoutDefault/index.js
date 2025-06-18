import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './LayoutDefault.scss';
import searchIcon from "../../assets/icon/search.png";
import logo from "../../assets/images/logo_web.png";
import homeIcon from "../../assets/icon/home.png";
import friendsIcon from "../../assets/icon/friends.png";
import chattingIcon from "../../assets/icon/chatting.png";
import notificationIcon from "../../assets/icon/bell.png";
import avt from "../../assets/images/avtmacdinh.png";
import settingIcon from "../../assets/icon/settings.png";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../actions/userAction';
import { useEffect, useState } from 'react';
import axios from 'axios';

function LayoutDefault() {
    var isLogin = true;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.user.token);

    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!token) {
            const saveToken = localStorage.getItem("token");

            if (saveToken) 
                dispatch(login(token));
        }

        const checkAuth = async () => {
            const accessToken = token || localStorage.getItem("token");

            if (!accessToken) {
                navigate("/signin");
                return;
            }

            try {
                const res = await axios.post("http://localhost:8080/auth/introspect", {
                    token: accessToken
                })

                if (!res.data.result.valid) {
                    const refreshToken = await axios.post("http://localhost:8080/auth/refresh", {
                        token: accessToken
                    })

                    const newToken = refreshToken.data.result.token;

                    dispatch(login(newToken));
                    localStorage.setItem("token", newToken);
                }
            }
            catch (err) {
                dispatch(logout(accessToken));
                navigate("/signin");
            }
            finally {
                setIsChecking(false);
            }
        }

        checkAuth();
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();

        dispatch(logout(token));
        const tokenLogout = "";
        localStorage.setItem("token", tokenLogout);

        if (!token) {
            navigate("/signin");
        }
    }
    
    const navLinkActive = (e) => {
        return e.isActive ? "header__link header__link--active" : "header__link";
    }

    if (isChecking) {
        return 
            <div>Đang kiểm tra đăng nhập...</div>;
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
                                {/* <img src={avt} />

                                <p>Nguyễn Đức Minh</p> */}

                                <div 
                                    to="signin" 
                                    className="header__signin"
                                    onClick={handleLogout}
                                >
                                    đăng xuất
                                </div>
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