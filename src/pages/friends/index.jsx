import { useEffect, useState } from "react";
import "./Friends.scss";
import { NavLink, Outlet } from 'react-router-dom';
import axios from "axios";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";

function Friends() {
    const API_BASE_URL = GetApiBaseUrl();
    const [userProfile, setUserProfile] = useState({});

    const getUserProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/api/profiles/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            setUserProfile(response.data.result);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, []);

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
                {
                    userProfile.id ? <Outlet context={userProfile}/> : <div>Đang tải dữ liệu...</div>
                }
                 
            </div>            
        </div>
    );
}

export default Friends;