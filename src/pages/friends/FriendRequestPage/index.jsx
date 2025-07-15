// FriendRequestsPage.js
import { useEffect, useState } from "react";
import axios from "axios";
import "./FriendRequestPage.scss";
import { useNavigate, useOutletContext } from "react-router-dom";

function FriendRequestsPage() {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    const userProfile = useOutletContext();

    const API_BASE_URL = "http://localhost:8080";

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/friendships/request`, {
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

    const handleAccept = async (requestId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.post(`${API_BASE_URL}/api/friendships/handling`, {
                otherUserId: requestId,
                status: "FRIEND"
            },{
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            }).then(() => {
                alert("đã đồng kết bạn");
            }).catch(() => {
                alert("lỗi chưa kết bạn được")
            }).finally(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
        } 
        catch (err) {
            console.log(err);
        }
    };

    const handleDecline = async (requestId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.post(`${API_BASE_URL}/api/friendships/handling`, {
                otherUserId: requestId,
                status: "NOT_FRIEND"
            },{
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            }).then(() => {
                alert("đã từ chối kết bạn");
            }).catch(() => {
                alert("lỗi chưa từ chối kết bạn được")
            }).finally(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            })
        } 
        catch (err) {
            console.log(err);
        }
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
                            <img src={request.avatarUrl} alt={request.fullName} onClick={() => navigate(`/profile/${request.id}`)} />

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
