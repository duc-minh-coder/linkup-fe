import { useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import "./Message.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";

function Message() {
    const navigate = useNavigate();
    const { receiverId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = "10";

    const getConversations = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_BASE_URL}/api/messages/conversation`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            // console.log(response.data.result);
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
                        "Content-Type": "application/json",
                    },
                    params: {
                        page: page,
                        size: PAGE_SIZE
                    }
                }
            );
            const messageList = response.data.result.reverse();

            setMessages(prev => [...messageList, ...prev]);
            setPage(prevPage => prevPage + 1);
    
            if (messageList.length < PAGE_SIZE) 
                setHasMore(false);
            
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
                        receiverId: conversation.userId,
                        content: content,
                    },
                    {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.log(err);
        }
    };

    const selectConversation = (conversation) => {
        setConversation(conversation);
        setMessages([]);
        setPage(0); 
        setHasMore(true);
        getMessages(conversation.userId);
        navigate(`/messages/${conversation.userId}`)
    };

    useEffect(() => {
        setMessages([]);
        getConversations();
    }, []);

    useEffect(() => {
        console.log(messages);
    }, [messages])

    useEffect(() => {
        if (receiverId && conversations.length > 0) {
            const conversationChoice = conversations.find((c) => 
                String(c.userId) === String(receiverId)
            );

            if (conversationChoice) 
                selectConversation(conversationChoice);
        }
    }, [receiverId, conversations]);

    return (
        <div className="message">
            <div className="message__content">
                <ConversationList
                    conversations={conversations}
                    otherUserId={receiverId}
                    onSelectConversation={selectConversation}
                />
                <ChatWindow
                    conversation={conversation}
                    messages={messages}
                    loading={loading}
                    onSendMessage={sendMessage}
                    onLoadMore={() => {
                        getMessages(conversation.userId);
                    }}
                    hasMore={hasMore}
                    currentId={receiverId}
                />
            </div>
        </div>
    );
}

export default Message;
