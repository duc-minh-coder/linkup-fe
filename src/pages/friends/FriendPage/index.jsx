import axios from "axios";
import "./FriendPage.scss";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

function FriendPage() {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const userProfile = useOutletContext();

    const API_BASE_URL = "http://localhost:8080";

    const fetchFriends = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const res = await axios.get(`${API_BASE_URL}/api/friendships/user/${userProfile.id}`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            });
            setFriends(res.data.result);
        } 
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [userProfile]);

    const handleMessage = (friendId) => {
        console.log("Nhắn tin tới", friendId);
        navigate(`/messages/${friendId}`);
    };

    const handleUnfriend = async (friendId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`${API_BASE_URL}/api/friendships/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    friendId: friendId
                }
            }).then(() => {
                toast.success("đã xoá kết bạn");
            }).catch(() => {
                toast.error("lỗi chưa xoá được kết bạn");
            }).finally(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        } catch (err) {
            console.log("Lỗi huỷ kết bạn", err);
        }
    };

    return (
        <div className="friends-page">
            <div className="container">
                <h2>Danh sách bạn bè</h2>
                
                <div className="friends-list">
                    {friends.map((friend) => (
                        <div className="friends-list__item" key={friend.id}>
                            <img src={friend.avatarUrl} alt={friend.fullName} onClick={() => navigate(`/profile/${friend.id}`)} />

                            <div className="friends-list__info">
                                <p>{friend.fullName}</p>

                                <div className="friend-actions">
                                    <button onClick={() => handleMessage(friend.id)}>Nhắn tin</button>
                                    <button onClick={() => handleUnfriend(friend.id)}>Huỷ kết bạn</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FriendPage;