import { useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import "./Message.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

function Message() {
    const navigate = useNavigate();
    const { receiverId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [stompCli, setStompCli] = useState(null);

    const API_BASE_URL = GetApiBaseUrl();
    const SOCKET_URL = `${API_BASE_URL}/ws`;
    const PAGE_SIZE = "10";

    const getUserInfo = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${API_BASE_URL}/api/profiles/user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserInfo(response.data.result);
        } catch (error) {
            console.log(error);
        }
    }

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
        if (!stompCli || conversation) {
            return;
        }

        stompCli.send("/app/chat.sendMessage", {}, JSON.stringify({
            senderId: userInfo.id,
            receiverId: conversation.userId,
            content: content,
            type: "CHAT"
        }))
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
        getUserInfo();
        setMessages([]);
        getConversations();
    }, []);

    useEffect(() => {
        if (!userInfo?.id) return;

        const socket = new SockJS(SOCKET_URL);
        const stompClient = Stomp.over(socket);
        setStompCli(stompClient);

        stompClient.connect({}, () => {
            console.log("connected to ws");
            
            //đưa user lên sv
            stompClient.send("/app/chat.addUser", {}, JSON.stringify({
                senderId: userInfo.id,
                type: "ONLINE"
            }))

            // nghe tin nhắn đc gửi từ sv
            stompClient.subscribe(`/user/${userInfo.id}/queue/messages`, (message) => {
                const messageBody = JSON.parse(message.body);
                console.log(messageBody);

                if (conversation?.userId === messageBody.senderId) {
                    setMessages(prev => [...prev, messageBody]);
                }
                
            })

            return () => {
                if (stompClient && stompClient.connect) 
                    stompClient.disconnect();
            }
        })
    }, [userInfo])

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
