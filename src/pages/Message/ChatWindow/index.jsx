import { useState, useEffect, useRef, useLayoutEffect, useContext } from "react";
import "./ChatWindow.scss";
import { Phone, Video, Bolt } from "lucide-react";
import { WebsocketContext } from "../../../contexts/WebsocketContext";
import axios from "axios";
import GetApiBaseUrl from "../../../helpers/GetApiBaseUrl";

function ChatWindow({ conversation, messages, loading, onSendMessage, onLoadMore, hasMore, currentId, isTyping, handleTyping, handleStopTyping }) {
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef(null);
    const isLoadOldMessages = useRef(false);
    const messagesContainerRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const typingTimeout = useRef(null);
    const [isOnline, setIsOnline] = useState(false);

    const { stompCli, userInfo, onlineList, isReady } = useContext(WebsocketContext);
    const API_BASE_URL = GetApiBaseUrl();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        
        if (messageInput.trim() && onSendMessage) {
            onSendMessage(messageInput.trim());
            setMessageInput("");
        }
    };

    const handleScroll = () => {
        if (!messagesContainerRef.current || loading) return;

        const { scrollTop, scrollHeight } = messagesContainerRef.current;
        if (scrollTop < 50 && hasMore) {
            prevScrollHeightRef.current = scrollHeight;
            isLoadOldMessages.current = true;
            onLoadMore(); //load thêm tin nhắn
        }
    };

    const  handleTypingChange = (e) => {
        const value = e.target.value;
        setMessageInput(value);

        if (!value.trim()) {
            handleStopTyping();
            return;
        }
        handleTyping();

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            handleStopTyping();
        }, 2000);
    }

    useEffect(() => {
        const container = messagesContainerRef.current;
        
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [loading, hasMore]);

    useLayoutEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        if (isLoadOldMessages.current && prevScrollHeightRef.current > 0) {
            // Đang load tin nhắn cũ: giữ vị trí cũ
            const newScrollHeight = container.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeightRef.current;

            container.scrollTop = scrollDiff;
            prevScrollHeightRef.current = 0;
            isLoadOldMessages.current = false;
        } else {
            // Chỉ scroll xuống khi gửi hoặc nhận tin nhắn mới
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        if (!userInfo?.id || !stompCli?.connected || !conversation?.userId) return;
        const token = localStorage.getItem("token");

        const checkOnline = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/online/checking/${conversation.userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setIsOnline(response.data.result);
            } catch (error) {
                console.log(error);
                setIsOnline(false);
            }
            
        }
        checkOnline();//gọi lần đầu khi chạy

        const interval = setInterval(checkOnline, 10000);

        return () => clearInterval(interval);
    }, [userInfo?.id, stompCli?.connected, conversation?.userId])

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
                    <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-window__header">
                <div className="chat-window__avatar-wrapper">
                    <img
                        src={conversation.userAvatarUrl}
                        alt={conversation.username}
                        className="chat-window__header__avatar"
                    />
                    {Array.isArray(onlineList) &&
                        onlineList.find(u => String(u.senderId) === String(conversation.userId)) && (
                            <span className="online-indicator" />
                        )
                    }
                </div>
                <div className="chat-window__header__info">
                    <h4>{conversation.username}</h4>
                    <p>{isOnline && 'Đang hoạt động'}</p>
                </div>
                <div className="chat-window__header__actions">
                    <button><Phone size={20}/></button>
                    <button><Video size={20}/></button>
                    <button><Bolt size={20}/></button>
                </div>
            </div>

            <div className={`chat-window__messages ${loading ? 'loading' : ''}`} ref={messagesContainerRef}>
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    <>
                        {messages.length === 0 ? (
                            <div className="no-messages">
                                <p>Hãy bắt đầu cuộc trò chuyện!</p>
                            </div>
                        ) : 
                        (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message-item ${
                                        String(message.senderId) === String(currentId) ? 'own' : 'other'
                                    }`}
                                >
                                    {String(message.senderId) !== String(currentId) && (
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
                {isTyping && <p>đang nhập...</p>}
            </div>

            <div className="chat-window__input">
                <form className="chat-window__input__form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={messageInput}
                        onChange={handleTypingChange}
                    />
                    <button type="submit" disabled={!messageInput.trim()} className="submit">
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;