import { useEffect, useState } from "react";
import "./Notifications.scss";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = "http://localhost:8080";

    // Mock data cho demo
    const mockNotifications = [
        {
            id: 1,
            type: "like",
            message: "Nguyễn Văn A đã thích bài viết của bạn",
            avatar: "https://via.placeholder.com/40",
            time: "2 giờ trước",
            isRead: false
        },
        {
            id: 2,
            type: "comment",
            message: "Trần Thị B đã bình luận về bài viết của bạn",
            avatar: "https://via.placeholder.com/40",
            time: "5 giờ trước",
            isRead: false
        },
        {
            id: 3,
            type: "send-request",
            message: "Lê Văn C đã gửi cho bạn 1 lời mời kết bạn",
            avatar: "https://via.placeholder.com/40",
            time: "1 ngày trước",
            isRead: true
        },
        {
            id: 4,
            type: "like",
            message: "Phạm Thị D đã thích bài viết của bạn",
            avatar: "https://via.placeholder.com/40",
            time: "2 ngày trước",
            isRead: true
        },
        {
            id: 5,
            type: "comment",
            message: "Hoàng Văn E đã nhắc đến bạn trong một bình luận",
            avatar: "https://via.placeholder.com/40",
            time: "3 ngày trước",
            isRead: true
        }
    ];

    const getNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Uncomment khi có API thật
            // const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //         "Content-Type": "application/json"
            //     }
            // });
            // setNotifications(response.data.result);
            
            // Sử dụng mock data
            setTimeout(() => {
                setNotifications(mockNotifications);
                setLoading(false);
            }, 1000);
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
            case "like":
                return "❤️";
            case "comment":
                return "💬";
            case "send-request":
                return "👤";
            default:
                return "🔔";
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
                        {notifications.some(n => !n.isRead) && (
                            <button 
                                className="mark-all-read-btn"
                                onClick={markAllAsRead}
                            >
                                Đánh dấu tất cả đã đọc
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="notifications-content">
                <div className="container">
                    {notifications.length === 0 ? (
                        <div className="empty-notifications">
                            <div className="empty-icon">🔔</div>
                            <h3>Chưa có thông báo nào...</h3>
                        </div>
                    ) : (
                        <div className="notifications-list">
                            {notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                                >
                                    <div className="notification-avatar">
                                        <img src={notification.avatar} alt="Avatar" />
                                        <span className="notification-type-icon">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                    </div>
                                    
                                    <div className="notification-content">
                                        <p className="notification-message">
                                            {notification.message}
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