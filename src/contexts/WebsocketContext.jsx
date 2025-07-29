import { createContext, useEffect, useRef, useState } from "react";
import GetApiBaseUrl from "../helpers/GetApiBaseUrl";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
    const [stompCli, setStompCli] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const [onlineList, setOnlineList] = useState([]);

    const [isReady, setIsReady] = useState(false);
    const stompConnection = useRef(null);

    const API_BASE_URL = GetApiBaseUrl();
    const SOCKET_URL = `${API_BASE_URL}/ws`;

    const getUserInfo = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(`${API_BASE_URL}/api/profiles/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            
            setUserInfo(response.data.result);
            setIsReady(true);
        } catch (error) {
            console.log(error);
        }
    }

    const initWebSocket = (userId) => {
        if (!userId) return;

        const token = localStorage.getItem("token");
        const client = Stomp.over(() => new SockJS(`${SOCKET_URL}?senderId=${userId}`));
        client.reconnectDelay = 5000;
        setStompCli(client);
        
        client.connect({}, () => {
            client.send("/app/chat.addUser", {}, JSON.stringify({
                senderId: userId,
                type: "ONLINE"
            }));

            axios.get(`${API_BASE_URL}/api/online`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((res) => {
                const result = res.data.result;

                const mapOnlineIds = result.map(id => ({
                    senderId: id,
                    type: "ONLINE"
                }))

                setOnlineList(mapOnlineIds);
            })

            client.subscribe("/topic/status", (message) => {
                const statusInfo = JSON.parse(message.body);

                setOnlineList(prev => {
                    if (statusInfo.type === "ONLINE") {
                        return prev.some(u => u.userId === statusInfo.senderId)
                            ? prev
                            : [...prev, statusInfo]
                    }
                    else if (statusInfo.type === "OFFLINE") {
                        return prev.filter(u => u.userId !== statusInfo.senderId);
                    }

                    return prev;
                })
            })
            
            stompConnection.current = client;
            
        }, (err) => {
            console.error("WebSocket error:", err);
        });
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo?.id) {
            initWebSocket(userInfo.id);
        }

        const handleBeforeUnload = () => {
            if (stompConnection.current) {
                stompConnection.current.send("/app/chat.addUser", {}, JSON.stringify({
                    senderId: userInfo.id,
                    type: "OFFLINE"
                }))

                stompConnection.current.disconnect();
            }
        }

        // khi ng dùng thoat v f5 thì sẽ bắt sk này trc khi trình duyệt thoát v f5
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);

            if (stompConnection.current) {
                stompConnection.current.disconnect();
            }
        }
    }, [userInfo?.id])

    useEffect(() => {
        if (!userInfo?.id || !stompCli?.connected) return;

        const interval = setInterval(() => {
            stompCli.send("app/chat.addUser", {}, JSON.stringify({
                senderId: userInfo.id,
                type: "ONLINE"
            }))
        }, 10000);

        return () => clearInterval(interval);
    }, [userInfo?.id, stompCli?.connected])

    return (
        <WebsocketContext.Provider value={{ stompCli, userInfo, onlineList, isReady }}>
            {children}
        </WebsocketContext.Provider>
    );
}
