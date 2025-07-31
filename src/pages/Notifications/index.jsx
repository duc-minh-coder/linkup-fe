import { useEffect, useState } from "react";
import "./Notifications.scss";
import { Bell, Heart, MessageSquareText, User } from "lucide-react";
import axios from "axios";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = "http://localhost:8080";

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
            
            // Uncomment khi có API thật
            // await axios.patch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {}, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //         "Content-Type": "application/json"
            //     }
            // });
            
            // Cập nhật local state
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, isRead: true }
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
            
            // Uncomment khi có API thật
            // await axios.patch(`${API_BASE_URL}/api/notifications/read-all`, {}, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //         "Content-Type": "application/json"
            //     }
            // });
            
            // Cập nhật local state
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, isRead: true }))
            );
        } catch (err) {
            console.log(err);
        }
    };

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
                <div className="notifications-header">
                    <div className="container">
                        <div className="header-content">
                            <h1>Thông báo</h1>
                        </div>
                    </div>
                </div>

                <div className="notifications-content">
                    <div className="container">
                        <div className="loading">
                            <div className="loading-spinner"></div>
                            <p>Đang tải thông báo...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications">
            <div className="notifications-header">
                <div className="container">
                    <div className="header-content">
                        <h1>Thông báo</h1>
                    </div>
                </div>
            </div>
            
            <div className="notifications-content">
                <div className="container">
                    {notifications.length === 0 ? (
                        <div className="empty-notifications">
                            <div className="empty-icon"><Bell size={48} color="white" /></div>
                            <h3>Chưa có thông báo nào...</h3>
                        </div>
                    ) : (
                        <div className="notifications-list">
                            {notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                    // onClick={() => !notification.isRead && markAsRead(notification.id)}
                                >
                                    <div className="notification-avatar">
                                        <img src={notification.actorAvt} alt="Avatar" />
                                        <span className="notification-type-icon">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                    </div>
                                    
                                    <div className="notification-content">
                                        <p className="notification-message">
                                            {getNotificationMessage(notification.actorName, notification.type)}
                                        </p>
                                        <span className="notification-time">
                                            {notification.time}
                                        </span>
                                    </div>
                                    
                                    {!notification.isRead && (
                                        <div className="unread-indicator"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notifications;