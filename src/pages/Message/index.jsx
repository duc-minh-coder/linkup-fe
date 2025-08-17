import { useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import "./Message.scss";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";
import { WebsocketContext } from "../../contexts/WebsocketContext";

function Message() {
    const navigate = useNavigate();
    const { receiverId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [initSelected, setInitSelected] = useState(false);
    const conversationRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = "10";

    const { stompCli, userInfo, onlineList, isReady } = useContext(WebsocketContext);

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

    const getUnreadCounts = async () => {
        try {
            const token = localStorage.getItem("token");

            axios.get(`${API_BASE_URL}/api/messages/unread-counts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(res => {
                const data = res.data.result;
                setUnreadCounts(data);
            }).catch((err) => console.log(err))
        } catch (error) {
            console.log(error);
        }
    }

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

    const handleTyping = async () => {
        if (!stompCli || !conversation) {
            return;
        }
        const messageData = {
            senderId: userInfo.id,
            receiverId: conversation.userId,
            typing: "TYPING",
            createdTime: new Date()
        }

        stompCli.send("/app/chat.typing", {}, JSON.stringify(messageData))
    }

    const handleStopTyping = async () => {
        if (!stompCli || !conversation) {
            return;
        }
        const messageData = {
            senderId: userInfo.id,
            receiverId: conversation.userId,
            typing: "STOP_TYPING",
            createdTime: new Date()
        }

        stompCli.send("/app/chat.stopTyping", {}, JSON.stringify(messageData))
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

        setConversations(prevConversations => {
            const updated = prevConversations.map(prevConversation => 
                prevConversation.userId === messageData.receiverId
                ? { ...prevConversation, 
                    lastMessage: messageData.content, 
                    lastMessageTime: new Date(), 
                    userSentLast: true
                }
                : prevConversation
            )

            const targetConversation = 
                updated.find(conversation => conversation.userId === messageData.receiverId);

            const otherConversation = 
                updated.filter(conversation => conversation.userId !== messageData.receiverId);

            return [targetConversation, ...otherConversation];
        })
    };

    const selectConversation = async (newConversation) => {
        if (conversation && conversation?.userId === newConversation.userId) return;
        
        conversationRef.current = newConversation;
        setMessages([]);
        setPage(0);
        setHasMore(true);
        setConversation(newConversation);
        setUnreadCounts(prev => ({
            ...prev,
            [newConversation.userId]: 0
        }))
        navigate(`/messages/${newConversation.userId}`);
        await getMessages(newConversation.userId);
    };

    useEffect(() => {
        if (!isReady || !userInfo?.id) return;

        setInitSelected(false);
        getUnreadCounts();
        getConversations();
            
    }, [isReady, userInfo?.id]);

    useEffect(() => {
        if (!stompCli) return;

        let subscribe;

        const trySubscribe = () => {
            if (stompCli.connected) {
                subscribe = stompCli.subscribe(`/user/queue/messages`, (message) => {
                    const messageBody = JSON.parse(message.body);
                    const token = localStorage.getItem("token");

                    if (
                        conversationRef && String(conversationRef.current.userId) === String(messageBody.senderId)
                    ) {
                        if (userInfo.id !== messageBody.senderId) {
                            axios.post(`${API_BASE_URL}/api/messages/mark-read`, {}, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                }, params: {
                                    otherUserId: conversationRef.current.userId
                                }
                            })

                            switch (messageBody.type) {
                                case "CHAT":
                                    setMessages(prev => [...prev, messageBody]);
                                    break;
                                case "TYPING":
                                    setIsTyping(true);
                                    break;
                                case "STOP_TYPING":
                                    setIsTyping(false);
                                    break;
                                default:
                                    break;
                            }
                        }
                    } else { // thuộc về đoạn chat khác
                        if (messageBody.type === "CHAT") {
                            setUnreadCounts(prevConversation => ({
                                ...prevConversation,
                                [messageBody.senderId]: ((prevConversation[messageBody.senderId] || 0) + 1)
                            }))
                        }      
                    }
                    
                    setConversations(prevConversations => {             
                        const updated = prevConversations.map(prevConversation => 
                            prevConversation.userId === messageBody.senderId
                            ? { 
                                ...prevConversation, 
                                lastMessage:messageBody.type === "CHAT" ? messageBody.content : prevConversation.lastMessage, 
                                lastMessageTime:messageBody.type === "CHAT" ? new Date() : prevConversation.createdTime, 
                                userSentLast: false
                            }
                            : prevConversation
                        )
                        if (messageBody.type === "CHAT") {
                            const targetConversation = 
                                updated.find(conversation => conversation.userId === messageBody.senderId);

                            const otherConversation = 
                                updated.filter(conversation => conversation.userId !== messageBody.senderId); // phần còn lại

                            return [targetConversation, ...otherConversation];
                        }
                        
                        return updated;
                    })
                })
            }
            else {
                console.log("chưa kết nối được chờ 2s");
                setTimeout(trySubscribe, 2000);
            }
        }
        trySubscribe();

        return () => {
            if (subscribe) subscribe.unsubscribe();
        }
    }, [stompCli])

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
    
    if (!isReady) {
        return <div>Loading...</div>;
    }

    return (
        <div className="message">
            <div className="message__content">
                <ConversationList
                    conversations={conversations}
                    otherUserId={receiverId}
                    onSelectConversation={selectConversation} 
                    onlineList={onlineList}
                    unreadCounts={unreadCounts}
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
                    isTyping={isTyping}
                    handleTyping={handleTyping}
                    handleStopTyping={handleStopTyping}
                />
            </div>
        </div>
    );
}

export default Message;
