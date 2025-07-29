import { useContext, useState } from "react";
import "./ProfileInfo.scss";
import { NavLink, useNavigate } from "react-router-dom";
import ImageViewer from "../ImageViewer";
import ConfigContainer from "../ConfigContainer";
import GetApiBaseUrl from "../../../helpers/GetApiBaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { WebsocketContext } from "../../../contexts/WebsocketContext";

function ProfileInfo({ userInfo, isOwner, handlingOpenEditProfileComponent, handleFriend, handleNotAccept }) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [showConfig, setShowConfig] = useState(false);

    const API_BASE_URL = GetApiBaseUrl();
    const { stompCli, onlineList } = useContext(WebsocketContext);

    const handlingViewAvatar = () => {
        setShowImageViewer(true);
    }

    const handlingCloseConfig = () => {
        setShowConfig(false);
    }

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {
                token: token
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(() => {
                toast.success("đã đăng xuất");

                navigate("/signin");
            }).catch(() => {
                toast.error("lỗi đăng xuất");
            })
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`${API_BASE_URL}/api/users/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(() => {
                toast.success("đã xoá tài khoản");

                navigate("/signin");
            }).catch(() => {
                toast.error("lỗi chưa xoá được tài khoản");
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="profile-info">
            <div className="container">
                <div className="profile-content">
                    <div className="profile-info__avatar-wrapper">
                        <img
                            src={userInfo.avatarUrl}
                            alt="avatar"
                            className="profile-info__avatar"
                            onClick={handlingViewAvatar}
                        />
                        {Array.isArray(onlineList) &&
                            onlineList.find(u => String(u.senderId) === String(userInfo.id)) && (
                                <span className="online-indicator" />
                            )
                        }
                    </div>
                    
                    <div className="profile-details">
                        <div className="profile-header-info">
                            <h2>{userInfo.fullName}</h2>

                            <div className="profile-actions">
                                {!isOwner && (
                                <>
                                    <button
                                        className={`add-friend-btn ${userInfo.role == "FRIEND" ? 'is-friend' : ''}`}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        onClick={() => handleFriend()}
                                    >
                                        {
                                            userInfo.friendshipStatus === "FRIEND"
                                                ? isHovered 
                                                    ? "huỷ kết bạn"
                                                    : "bạn bè"
                                                : userInfo.friendshipStatus === "REQUEST_SENT" 
                                                    ? "đã gửi kết bạn"
                                                    : userInfo.friendshipStatus === "REQUEST_RECEIVED"
                                                        ? "chấp nhận"
                                                        : "gửi kết bạn"
                                        }

                                    </button>
                                    {(userInfo.friendshipStatus === "REQUEST_RECEIVED") &&
                                        <button
                                            className={`add-friend-btn`}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                            onClick={() => handleNotAccept()}
                                        >từ chối</button>
                                        }
                                    <button 
                                        className="message-btn" 
                                        onClick={() => {navigate(`/messages/${userInfo.id}`)}}
                                    >Nhắn tin</button>
                                </>
                                )}
                                
                                {/* btn chỉnh sửa profile cho mình */}
                                {isOwner && (
                                    <button 
                                        className="edit-profile-btn" 
                                        onClick={() => handlingOpenEditProfileComponent()}>
                                            Chỉnh sửa trang cá nhân
                                    </button>
                                )}
                                <div className="more-btn-container">
                                    <button 
                                        className="more-btn"
                                        onClick={() => setShowConfig(true)}
                                    >⋯</button>

                                    {showConfig && 
                                        <ConfigContainer 
                                            isOwner={isOwner} 
                                            handlingCloseConfig={handlingCloseConfig} 
                                            handleLogout={handleLogout}
                                            handleDeleteAccount={handleDeleteAccount}
                                        />} 
                                </div>
                            </div>
                        </div>
                        <div className="profile-stats">
                            <span><strong>{userInfo.countPost}</strong> bài viết</span>
                            <NavLink to="/friends" className="profile-stats__text">
                                <strong>{userInfo.countFriend}</strong> bạn bè
                            </NavLink>
                        </div>

                        <div className="profile-bio">
                            <p>{userInfo.bio}</p>
                        </div>
                    </div>
                </div>
            </div>

            {showImageViewer && (
                <ImageViewer
                    isOwner={isOwner}
                    images={userInfo.avatarUrl}
                    onClose={() => setShowImageViewer(false)}
                />
            )}
        </div>
    );
}

export default ProfileInfo;