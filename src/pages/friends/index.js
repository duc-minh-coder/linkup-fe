import axios from "axios";
import "./Friends.scss";
import { useEffect, useState } from "react";

function Friends() {
    const [friends, setFriends] = useState([]);
    const API_BASE_URL = "http://localhost:8080";

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/friends`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFriends(res.data.result);
        } 
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <div className="friends-page">
            <div className="container">
                <h2>Danh sách bạn bè</h2>
                
                <div className="friends-grid">
                    {friends.map((friend) => (
                        <div className="friend-card" key={friend.id}>
                            <img src={friend.avatarUrl} alt={friend.fullName} />
                            <p>{friend.fullName}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Friends;