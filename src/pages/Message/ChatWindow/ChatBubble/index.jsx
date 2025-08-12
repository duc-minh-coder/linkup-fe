import { Ellipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./ChatBubble.scss";

function ChatBubble({ message, currentId, conversation }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openIsRead, setOpenIsRead] = useState();
    const menuRef = useRef(null);
    const bubbleRef = useRef(null);
    

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
                setOpenIsRead(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const isOwnMessage = String(message.senderId) === String(currentId);

    return (
        <div className={`chat-bubble ${isOwnMessage ? "own" : ""}`}>
            {!isOwnMessage && (
                <img
                    src={conversation.userAvatarUrl}
                    alt={conversation.username}
                    className="chat-bubble__avatar"
                />
            )}

            <div className="chat-bubble__content">
                <div className="chat-bubble__bubble-wrapper">
                    <div className="chat-bubble__bubble" 
                        onClick={() => setOpenIsRead(!openIsRead)} 
                        ref={bubbleRef}
                    >
                        {message.content}
                    </div>

                    {/* Nút 3 chấm */}
                    <div className="chat-bubble__actions" ref={menuRef}>
                        <div
                            className="chat-bubble__menu-trigger"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <Ellipsis 
                                size={18} 
                                color="white" 
                                className={`config-btn ${isOwnMessage ? "own" : ""}`} />
                        </div>

                        <div className={`chat-bubble__menu ${menuOpen ? "open" : ""}`}>
                            {isOwnMessage ? (
                                <>
                                    <button>✏️ Sửa</button>
                                    <button>🗑️ Xóa với bạn</button>
                                    <button>❌ Xóa với mọi người</button>
                                </>
                            ) : (
                                <button>🗑️ Xóa với bạn</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="chat-bubble__time">
                    {formatDate(message.createdTime)}
                </div>

                {openIsRead && 
                    <div className="chat-bubble__read-status">
                        đã xem
                    </div>}
            </div>
        </div>
    );
}

export default ChatBubble;
