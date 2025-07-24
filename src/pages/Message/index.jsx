import { useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import "./Message.scss";
import { useEffect, useRef, useState } from "react";
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
    const stompConnection = useRef(null);
    const [initSelected, setInitSelected] = useState(false);
    const conversationRef = useRef(null);

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

            setMessages(prev => {
                const existingIds = new Set(prev.map(msg => msg.id));
                const newMessages = messageList.filter(msg => !existingIds.has(msg.id));

                return [...newMessages, ...prev];
            });
            
            setPage(prevPage => prevPage + 1);
    
            if (messageList.length < PAGE_SIZE) 
                setHasMore(false);
            
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const typing = async () => {

    }

    const stopTyping = async () => {

    }

    const sendMessage = async (content) => {
        if (!stompCli || !conversation) {
            return;
        }

        const messageData = {
            senderId: userInfo.id,
            receiverId: conversation.userId,
            content: content,
            type: "CHAT",
            createdTime: new Date()
        };

        stompCli.send("/app/chat.sendMessage", {}, JSON.stringify(messageData));

        setMessages(prev => [...prev, messageData]);
    };

    const selectConversation = async (newConversation) => {
        if (conversation && conversation?.userId === newConversation.userId) return;

        setMessages([]);
        setPage(0);
        setHasMore(true);
        setConversation(newConversation);
        navigate(`/messages/${newConversation.userId}`);
        await getMessages(newConversation.userId);
    };

    const initWebsocket = (userId) => {
        if (stompConnection.current) {
            stompConnection.current.disconnect();
        }

        if (!userId) return;

        const socket = new SockJS(`${SOCKET_URL}?senderId=${userId}`);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            //đưa user lên sv
            stompClient.send("/app/chat.addUser", {}, JSON.stringify({
                senderId: userId,
                type: "ONLINE"
            }))
            // nghe tin nhắn đc gửi từ sv
            // tự động thêm /user/id vào trc vì be dùng convertAndSendToUser
            stompClient.subscribe(`/user/queue/messages`, (message) => {
                const messageBody = JSON.parse(message.body);

                if (conversationRef && String(conversationRef.current.userId) === String(messageBody.senderId)) {
                    // setMessages(prev => {
                    //     const existingId = prev.some(msg => msg.id === messageBody.id);
                    //     if (existingId) return prev;

                    //     return [...prev, messageBody];
                    // });

                    setMessages(prev => [...prev, messageBody]);
                }
                else {
                    setConversations(prevConversations => 
                        prevConversations.map(prevConversation => 
                            prevConversation.userId === messageBody.senderId
                            ? { ...prevConversation, lastMessage: messageBody.content} 
                            : prevConversation
                        )
                    )
                }
            })

            setStompCli(stompClient);
            stompConnection.current = stompClient;
        } , (err) => {
            console.log(err);
        })

        return stompClient;
    }

    useEffect(() => {
        getUserInfo();
        getConversations();
        setInitSelected(false);

        return () => {
            if (stompConnection.current) {
                stompConnection.current.disconnect();
            }
        }
    }, []);

    useEffect(() => {
        if (userInfo?.id) {
            initWebsocket(userInfo.id);
        }

        return () => {
            if (stompConnection.current) {
                stompConnection.current.disconnect();
            }
        }
    }, [userInfo.id])

    useEffect(() => {
        if (!receiverId || conversations.length === 0 || initSelected) return;

        const conversationChoice = conversations.find((c) => 
            String(c.userId) === String(receiverId)
        );

        if (conversationChoice) {
            selectConversation(conversationChoice);
            setInitSelected(true);
        }
    }, [receiverId, conversations, initSelected]);

    useEffect(() => {
        conversationRef.current = conversation;
    }, [conversation])

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
                        if (conversation)
                            getMessages(conversation.userId);
                    }}
                    hasMore={hasMore}
                    currentId={userInfo.id}
                />
            </div>
        </div>
    );
}

export default Message;
