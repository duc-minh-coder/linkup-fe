import { useState, useEffect, useRef } from "react";
import "./ChatWindow.scss";

function ChatWindow({ conversation, messages, loading, onSendMessage }) {
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef(null);
    const currentUserId = localStorage.getItem("currentUserId"); // Giả sử có lưu ID người dùng hiện tại

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
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
                    <button>📞</button>
                    <button>📹</button>
                    <button>ⓘ</button>
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
                            messages.map(message => (
                                <div
                                    key={message.senderId}
                                    className={`message-item ${
                                        message.senderId === currentUserId ? 'own' : 'other'
                                    }`}
                                >
                                    {message.senderId !== currentUserId && (
                                        <img
                                            src={message.userAvatarUrl || '/default-avatar.png'}
                                            alt={message.username}
                                            className="message-item__avatar"
                                        />
                                    )}
                                    <div className="message-item__content">
                                        <div className="message-item__content__bubble">
                                            {message.content}
                                        </div>
                                        <div className="message-item__content__time">
                                            {formatTime(message.createdAt)}
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