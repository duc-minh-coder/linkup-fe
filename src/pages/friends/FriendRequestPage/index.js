// FriendRequestsPage.js
import { useEffect, useState } from "react";
import axios from "axios";
import "./FriendRequestPage.scss";

function FriendRequestsPage() {
    const [requests, setRequests] = useState([]);
    const API_BASE_URL = "http://localhost:8080";

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/friends/requests`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            setRequests(res.data.result);
        } 
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setRequests([
            {
                id: 1,
                fullName: "Nguyễn Văn A",
                avatarUrl: "https://i.pravatar.cc/150?img=3"
            },
            {
                id: 2,
                fullName: "Trần Thị B",
                avatarUrl: "https://i.pravatar.cc/150?img=5"
            },
            {
                id: 3,
                fullName: "Lê C",
                avatarUrl: "https://i.pravatar.cc/150?img=7"
            }
        ]);
    }, []);

    const handleAccept = async (requestId) => {
        // Call API accept friend
    };

    const handleDecline = async (requestId) => {
        // Call API decline friend
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="friends-request-page">
            <div className="container">
                <h2>Lời mời kết bạn</h2>

                <div className="request-list">
                    {requests.map((request) => (
                        <div className="request-list__item" key={request.id}>
                            <img src={request.avatarUrl} alt={request.fullName} />

                            <div className="request-list__info">
                                <p>{request.fullName}</p>

                                <div className="friend-actions">
                                    <button onClick={() => handleAccept(request.id)}>Chấp nhận</button>
                                    <button onClick={() => handleDecline(request.id)}>Từ chối</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FriendRequestsPage;
