import { useContext, useEffect, useState } from "react";
import "./ConversationList.scss";

function ConversationList({ conversations, otherUserId, onSelectConversation, onlineList }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(conversation =>
        conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRelativeTime = (dateSting) => {
        const date = new Date(dateSting);
        const now = new Date();

        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "vừa xong";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

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
                {filteredConversations.length === 0 ? 
                (
                    <div className="no-conversations">
                        <p>Kết thêm bạn để nhắn tin</p>
                    </div>
                ) : 
                (
                    filteredConversations.map(conversation => (
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
                                    getRelativeTime(conversation.lastMessageTime)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ConversationList;