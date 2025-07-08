// FriendRequestsPage.js
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileHeader from "../Profile/ProfileHeader";
import "./FriendsPage.scss";

function FriendRequestsPage() {
    const [requests, setRequests] = useState([]);
    const API_BASE_URL = "http://localhost:8080";

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/friends/requests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data.result);
        } 
        catch (err) {
            console.log(err);
        }
    };

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
        <div className="friends-page">
            <div className="container">
                <h2>Lời mời kết bạn</h2>
                <div className="friends-grid">
                {requests.map((req) => (
                    <div className="friend-card" key={req.id}>
                        <img src={req.avatarUrl} alt={req.fullName} />
                        <p>{req.fullName}</p>
                        <div className="friend-actions">
                            <button onClick={() => handleAccept(req.id)}>Chấp nhận</button>
                            <button onClick={() => handleDecline(req.id)}>Từ chối</button>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}

export default FriendRequestsPage;
