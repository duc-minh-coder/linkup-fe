import { useContext, useEffect, useState } from "react";
import "./ConversationList.scss";
import useDebounce from "../../../hooks/useDebounce";
import axios from "axios";
import GetApiBaseUrl from "../../../helpers/GetApiBaseUrl";

function ConversationList({ conversations = [], otherUserId, onSelectConversation, onlineList, unreadCounts }) {
    const [searchTerm, setSearchTerm] = useState("");
    const debounceText = useDebounce(searchTerm, 300);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [init, setInit] = useState(true);
    const [searchResult, setSearchResult] = useState([]);

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = "3";

    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMs = now - date;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            // Nếu trong vòng 1 phút
            if (diffInMinutes < 1) {
                return 'Vừa xong';
            }
            // Nếu trong vòng 1 giờ
            else if (diffInMinutes < 60) {
                return `${diffInMinutes} phút trước`;
            }
            // Nếu trong vòng 24 giờ
            else if (diffInHours < 24) {
                return `${diffInHours} giờ trước`;
            }
            // Nếu trong vòng 7 ngày
            else if (diffInDays < 7) {
                return `${diffInDays} ngày trước`;
            }
            // Ngày cụ thể
            else {
                return date.toLocaleDateString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const seeMore = () => {
        setPage(prev => prev + 1);
    }

    useEffect(() => {
        if (debounceText?.trim()) {
            setIsLoading(true);

            const getFriend = async () => {
                const token = localStorage.getItem("token");

                try {
                    await axios.post(`${API_BASE_URL}/api/messages/conversation/search`, {
                        text: debounceText
                    },{
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }, 
                        params: {
                            page: page,
                            size: PAGE_SIZE
                        }
                    }).then((response) => {
                        const data = response.data.result;

                        if (page === 0)
                            setSearchResult(data);
                        else 
                            setSearchResult(prev => [...prev, ...data]);
                        setIsLoading(false);
                    })
                } catch (error) {
                    console.log(error);
                    setIsLoading(false);
                }
            }

            getFriend();
        }
    }, [debounceText, page])

    return (
        <div className="conversation-list">       
            <div className="conversation-list__search">
                <input
                    type="text"
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="conversation-list__conversations">
                {conversations.length === 0 ? 
                (
                    <div className="no-conversations">
                        <p>Kết thêm bạn để nhắn tin</p>
                    </div>
                ) : 
                ( 
                    searchTerm.trim() && searchResult.length > 0 
                        ? searchResult.map((conversation) => (
                            <div
                                key={conversation.userId}
                                className={`conversation-item ${
                                    String(otherUserId) === String(conversation.userId) ? 'active' : ''
                                }`}
                                onClick={() => {
                                    onSelectConversation(conversation)
                                }}
                            >
                                <div className="conversation-item__avatar-wrapper">
                                    <img
                                        src={conversation.userAvatarUrl}
                                        alt={conversation.username}
                                        className="conversation-item__avatar"
                                    />
                                    {Array.isArray(onlineList) &&
                                        onlineList.find(u => String(u.senderId) === String(conversation.userId)) && (
                                            <span className="online-indicator" />
                                        )
                                    }
                                    {unreadCounts[conversation.userId] > 0 && (
                                        <span className="unread-badge">
                                            {unreadCounts[conversation.userId] > 99 ? '99+' : unreadCounts[conversation.userId]}
                                        </span>
                                    )}
                                </div>
                                <div className="conversation-item__info">
                                    <h4 className="conversation-item__info__name">
                                        {conversation.username} 
                                    </h4>

                                    <p className="conversation-item__info__message">
                                        {conversation.userSentLast ? 'bạn: ' : ''}
                                        {conversation.lastMessage ? conversation.lastMessage : 'Chưa có tin nhắn'}
                                    </p>
                                </div>
                                <span className="conversation-item__time">
                                    {conversation.lastMessageTime && 
                                        formatDate(conversation.lastMessageTime)}
                                </span>
                            </div>
                        ))
                        : conversations.map(conversation => (
                            <div
                                key={conversation.userId}
                                className={`conversation-item ${
                                    String(otherUserId) === String(conversation.userId) ? 'active' : ''
                                }`}
                                onClick={() => {
                                    onSelectConversation(conversation)
                                }}
                            >
                                <div className="conversation-item__avatar-wrapper">
                                    <img
                                        src={conversation.userAvatarUrl}
                                        alt={conversation.username}
                                        className="conversation-item__avatar"
                                    />
                                    {Array.isArray(onlineList) &&
                                        onlineList.find(u => String(u.senderId) === String(conversation.userId)) && (
                                            <span className="online-indicator" />
                                        )
                                    }
                                    {unreadCounts[conversation.userId] > 0 && (
                                        <span className="unread-badge">
                                            {unreadCounts[conversation.userId] > 99 ? '99+' : unreadCounts[conversation.userId]}
                                        </span>
                                    )}
                                </div>
                                <div className="conversation-item__info">
                                    <h4 className="conversation-item__info__name">
                                        {conversation.username} 
                                    </h4>

                                    <p className="conversation-item__info__message">
                                        {conversation.userSentLast ? 'bạn: ' : ''}
                                        {conversation.lastMessage ? conversation.lastMessage : 'Chưa có tin nhắn'}
                                    </p>
                                </div>
                                <span className="conversation-item__time">
                                    {conversation.lastMessageTime && 
                                        formatDate(conversation.lastMessageTime)}
                                </span>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}

export default ConversationList;