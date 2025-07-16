// FriendRequestsPage.js
import { useEffect, useState } from "react";
import axios from "axios";
import "./FriendRequestPage.scss";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import GetApiBaseUrl from "../../../helpers/GetApiBaseUrl";

function FriendRequestsPage() {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    const userProfile = useOutletContext();
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = "5";

    const fetchRequests = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await axios.get(`${API_BASE_URL}/api/friendships/request/${userProfile.id}`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }, 
                params: {
                    page: page,
                    size: PAGE_SIZE
                }
            });

            const pageResult = res.data.result;
            setPage(prev => prev + 1);
            setRequests(prev => [...prev, ...pageResult]);

            if (pageResult.length < PAGE_SIZE) {
                setHasMore(false);
            }
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
                toast.success("đã đồng kết bạn");
            }).catch(() => {
                toast.error("lỗi chưa kết bạn được")
            }).finally(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
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
                toast.success("đã từ chối kết bạn");
            }).catch(() => {
                toast.error("lỗi chưa từ chối kết bạn được")
            }).finally(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        } 
        catch (err) {
            console.log(err);
        }
    };

    const seeMore = () => {
        fetchRequests();
    }

    useEffect(() => {
        fetchRequests();
    }, [userProfile]);

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

                    {hasMore && (
                        <div className="see-more" onClick={seeMore}>
                            Xem thêm
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FriendRequestsPage;
