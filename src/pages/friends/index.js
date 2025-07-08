import "./Friends.scss";
import { NavLink, Outlet, useLocation } from 'react-router-dom';

function Friends() {
    return (
        <div className="friends-component">
            <div className="friend-header">
                <NavLink 
                    to='/friends'
                    className={({ isActive }) => 
                        `friend-header__button ${isActive ? 'friend-header__button--active' : ''}`}>
                    Bạn bè của bạn
                </NavLink>

                <NavLink 
                    to='/friends/request' 
                    className={({ isActive }) => 
                        `friend-header__button ${isActive ? 'friend-header__button--active' : ''}`}>
                    Lời mời kết bạn
                </NavLink>
            </div>

            <div className="friend-content">
                <Outlet />    
            </div>            
        </div>
    );
}

export default Friends;