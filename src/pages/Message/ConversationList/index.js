import { useState } from "react";
import "./ConversationList.scss";

function ConversationList({ conversations, activeConversationById, onSelectConversation }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredConversations = conversations.filter(conversation =>
        conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h`;
        } else {
            return date.toLocaleDateString();
        }
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
                {filteredConversations.length === 0 ? (
                    <div className="no-conversations">
                        <p>Chưa có cuộc trò chuyện nào</p>
                    </div>
                ) : (
                    filteredConversations.map(conversation => (
                        <div
                            key={conversation.receiverId}
                            className={`conversation-item ${
                                activeConversationById === conversation.userId ? 'active' : ''
                            }`}
                            onClick={() => onSelectConversation(conversation)}
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
                                {conversation.lastMessageTime && formatTime(conversation.lastMessageTime)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ConversationList;