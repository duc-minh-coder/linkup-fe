import { useState, useEffect, useRef } from "react";
import "./ChatWindow.scss";
import { Phone, Video, Bolt } from "lucide-react";

function ChatWindow({ conversation, messages, loading, onSendMessage }) {
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setCurrentUserId(conversation?.userId);

        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && onSendMessage) {
            onSendMessage(messageInput.trim());
            setMessageInput("");
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

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

    if (!conversation) {
        return (
            <div className="chat-window">
                <div className="chat-window__empty">
                    <h3>Chọn một cuộc trò chuyện</h3>
                    <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-window__header">
                <img
                    src={conversation.userAvatarUrl || '/default-avatar.png'}
                    alt={conversation.username}
                    className="chat-window__header__avatar"
                />
                <div className="chat-window__header__info">
                    <h4>{conversation.username}</h4>
                    <p>Đang hoạt động</p>
                </div>
                <div className="chat-window__header__actions">
                    <button><Phone size={20}/></button>
                    <button><Video size={20}/></button>
                    <button><Bolt size={20}/></button>
                </div>
            </div>

            <div className={`chat-window__messages ${loading ? 'loading' : ''}`}>
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        {messages.length === 0 ? (
                            <div className="no-messages">
                                <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                            </div>
                        ) : 
                        (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message-item ${
                                        String(message.senderId) === String(currentUserId) ? 'own' : 'other'
                                    }`}
                                >
                                    {String(message.senderId) !== String(currentUserId) && (
                                        <img
                                            src={conversation.userAvatarUrl}
                                            alt={conversation.username}
                                            className="message-item__avatar"
                                        />
                                    )}
                                    <div className="message-item__content">
                                        <div className="message-item__content__bubble message-item__bubble">
                                            {message.content}
                                        </div>

                                        <div className="message-item__content__time">
                                            {formatDate(message.createdTime)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="chat-window__input">
                <form className="chat-window__input__form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button type="submit" disabled={!messageInput.trim()}>
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;