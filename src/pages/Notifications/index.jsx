import { useContext, useEffect, useState } from "react";
import "./Notifications.scss";
import { Bell, Heart, MessageSquareText, User } from "lucide-react";
import axios from "axios";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";
import { useNavigate } from "react-router-dom";
import DetailPost from "../HomePage/Feed/Post/DetailPost";
import { WebsocketContext } from "../../contexts/WebsocketContext"

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [choicePost, setChoicePost] = useState({});
    const [commentId, setCommentId] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const navigate = useNavigate();
    const { userInfo, onlineList } = useContext(WebsocketContext);

    const API_BASE_URL = GetApiBaseUrl();

    const getNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            
            const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            setNotifications(response.data.result);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, read: true }
                        : notification
                )
            );


        } catch (err) {
            console.log(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(`${API_BASE_URL}/api/notifications/read-all`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, read: true }))
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handlingShow = () => {
        setShowDetail(false);
    }

    const handleNotificationClick = async (notification) => {
        if (!notification.read) await markAsRead(notification.id);

        action(notification.type, notification.actorId, notification.postId, notification.commentId);
    }

    const getPostContent = async (postId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setChoicePost(response.data.result);
        } catch (error) {
            console.log(error);
        }
    }

    const handlingOpenDetailPost = async (postId) => {
        await getPostContent(postId);
        setShowDetail(true);
    }

    const action = (type, actorId, postId, commentId) => {
        switch (type) {
            case "POST_LIKE":
                handlingOpenDetailPost(postId);
                break;
            case "POST_COMMENT":
                setCommentId(commentId);
                handlingOpenDetailPost(postId);
                break;
            case "FRIEND_REQUEST":
            case "FRIEND_ACCEPTED":
                navigate(`/profile/${actorId}`);
                break;
        }
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case "POST_LIKE":
                return <Heart size={24} color="white" />;
            case "POST_COMMENT":
                return <MessageSquareText size={24} color="white" />;
            case "FRIEND_REQUEST":
                return <User size={24} color="white" />;
            case "FRIEND_ACCEPTED":
                return <User size={24} color="blue" />;
            default:
                return <Bell size={24} color="white" />;
        }
    };

    const getNotificationMessage = (senderName, type) => {
        switch (type) {
            case "POST_LIKE":
                return `${senderName} đã like bài viết của bạn`;
            case "POST_COMMENT":
                return `${senderName} đã comment bài viết của bạn`;
            case "FRIEND_REQUEST":
                return `${senderName} đã gửi cho bạn lời mời kết bạn`;
            case "FRIEND_ACCEPTED":
                return `${senderName} đã chấp nhận lời mời kết bạn`;
            default:
                return <Bell size={24} color="white" />;
        }
    };

    useEffect(() => {
        getNotifications();
    }, []);

    if (loading) {
        return (
            <div className="notifications">
                <div className="notifications__header">
                    <div className="notifications__container">
                        <div className="notifications__header-content">
                            <h1 className="notifications__title">Thông báo</h1>
                        </div>
                    </div>
                </div>

                <div className="notifications__content">
                    <div className="notifications__container">
                        <div className="notifications__loading">
                            <p className="notifications__loading-text">Đang tải thông báo...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications">
            <div className="notifications__header">
                <div className="notifications__container">
                    <div className="notifications__header-content">
                        <h1 className="notifications__title">Thông báo</h1>
                        <button
                            className="notifications__read-all"
                            onClick={markAllAsRead}
                        >
                            Đánh dấu đã đọc
                        </button>
                    </div>
                </div>
            </div>

            <div className="notifications__content">
                <div className="notifications__container">
                    {notifications.length === 0 ? (
                        <div className="notifications__empty">
                            <div className="notifications__empty-icon"><Bell size={48} color="white" /></div>
                            <h3 className="notifications__empty-title">Chưa có thông báo nào...</h3>
                        </div>
                    ) : (
                        <div className="notifications__list">
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notifications__item ${!notification.read ? 'notifications__item--unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notifications__avatar">
                                        <img src={notification.actorAvt} alt="Avatar" />
                                        <span className="notifications__icon">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                    </div>

                                    <div className="notifications__body">
                                        <p className="notifications__message">
                                            {getNotificationMessage(notification.actorName, notification.type)}
                                        </p>
                                        <span className="notifications__time">
                                            {notification.time}
                                        </span>
                                    </div>

                                    {!notification.read && (
                                        <div className="notifications__unread-dot"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showDetail && 
                <DetailPost
                    post={choicePost} 
                    userAvatar={userInfo.avatarUrl} 
                    handlingShow={handlingShow}
                    isAuthor={userInfo.id === choicePost.authorId ? true : false}
                    onlineList={onlineList}
                    commentId={commentId}
                />}
        </div>
    );
}

export default Notifications;