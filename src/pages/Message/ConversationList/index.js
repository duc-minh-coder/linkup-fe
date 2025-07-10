import { useState } from "react";
import "./ConversationList.scss";

function ConversationList({ conversations, otherUserId, onSelectConversation }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(conversation =>
        conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <p>Chưa có cuộc trò chuyện nào</p>
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
                            <img
                                src={conversation.userAvatarUrl}
                                alt={conversation.username}
                                className="conversation-item__avatar"
                            />
                            <div className="conversation-item__info">
                                <h4 className="conversation-item__info__name">
                                    {conversation.username}
                                </h4>

                                <p className="conversation-item__info__message">
                                    {conversation.lastMessage || 'Chưa có tin nhắn'}
                                </p>
                            </div>
                            <span className="conversation-item__time">
                                {conversation.lastMessageTime && formatDate(conversation.lastMessageTime)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ConversationList;