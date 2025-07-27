import { createContext, useEffect, useRef, useState } from "react";
import GetApiBaseUrl from "../helpers/GetApiBaseUrl";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
    const [stompCli, setStompCli] = useState(null);
    const [userInfo, setUserInfo] = useState({});
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
        } catch (error) {
            console.log(error);
        }
    }

    const initWebSocket = (userId) => {
        if (!userId) return;

        const client = Stomp.over(() => new SockJS(`${SOCKET_URL}?senderId=${userId}`));

        client.connect({}, () => {
            client.send("/app/chat.addUser", {}, JSON.stringify({
                senderId: userId,
                type: "ONLINE"
            }));
            setStompCli(client);
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
                stompConnection.current.send("app/chat.addUser", {}, JSON.stringify({
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

    return (
        <WebsocketContext.Provider value={{ stompCli, userInfo }}>
            {children}
        </WebsocketContext.Provider>
    );
}
