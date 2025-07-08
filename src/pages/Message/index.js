import { useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import "./Message.scss";
import { useEffect, useState } from "react";
import axios from "axios";

function Message() {
    const { receiverId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [activeConversationById, setActiveConversationById] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = "http://localhost:8080";

    const getConversations = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_BASE_URL}/api/messages/conversation/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log(response.data.result);
            setConversations(response.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    const getMessages = async (receiverId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_BASE_URL}/api/messages/conversation/${receiverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            console.log(response.data.result);
            setMessages(response.data.result);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_BASE_URL}/api/messages/send`, {
                receiverId: activeConversationById,
                content: content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            // Thêm tin nhắn mới vào danh sách
            setMessages(prev => [...prev, response.data.result]);
            
            // Cập nhật conversation list
            getConversations();
        } catch (err) {
            console.log(err);
        }
    };

    const selectConversation = (conversation) => {
        setActiveConversationById(conversation.userId);
        getMessages(conversation.userId);
    };

    useEffect(() => {
        getConversations();
    }, []);

    useEffect(() => {
        if (receiverId && conversations.length > 0) {
            const conversationChoice = conversations.find(c => c.userId === receiverId);

            if (conversationChoice) selectConversation(conversationChoice);
        }
    }, [receiverId, conversations]);

    return (
        <div className="message">
            <div className="message__content">
                a
                <ConversationList
                    conversations={conversations}
                    activeConversationById={activeConversationById}
                    onSelectConversation={selectConversation}
                />
                <ChatWindow
                    conversation={activeConversationById}
                    messages={messages}
                    loading={loading}
                    onSendMessage={sendMessage}
                />
            </div>
        </div>
    )
}

export default Message;