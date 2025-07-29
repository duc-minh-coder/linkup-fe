import axios from "axios";
import "./FriendPage.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import GetApiBaseUrl from "../../../helpers/GetApiBaseUrl";
import { WebsocketContext } from "../../../contexts/WebsocketContext";

function FriendPage() {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const userProfile = useOutletContext();
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [boxRequest, setBoxRequest] = useState(false);

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = "5";
    const { onlineList } = useContext(WebsocketContext);

    const fetchFriends = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await axios.get(`${API_BASE_URL}/api/friendships/friend/${userProfile.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, size: PAGE_SIZE }
            });

            const pageResult = res.data.result;
            setPage(prev => prev + 1);
            setFriends(prev => [...prev, ...pageResult]);

            if (pageResult.length < PAGE_SIZE) {
                setHasMore(false);
            }
        } catch (err) {
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

    const seeMore = () => {
        fetchFriends();
    }

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
                    {friends.map((friend) => {
                        const isOnline = onlineList.some(user => user.senderId === friend.id);

                        return (<div className="friends-list__item" key={friend.id}>
                            <div className="friends-list__avatar-wrapper">
                                <img 
                                    src={friend.avatarUrl} 
                                    alt={friend.fullName} 
                                    onClick={() => navigate(`/profile/${friend.id}`)} 
                                />

                                {isOnline && <span className="online-indicator" />}
                            </div>
                            <div className="friends-list__info">
                                <p>{friend.fullName}</p>

                                <div className="friend-actions">
                                    <button onClick={() => handleMessage(friend.id)}>Nhắn tin</button>
                                    <button onClick={() => setBoxRequest(true)}>Huỷ kết bạn</button>
                                </div>
                            </div>

                            {boxRequest && 
                                <div className="box-request">
                                    <div className="overlay" onClick={() => setBoxRequest(false)}></div>

                                    <div className="request">
                                        <h2>bạn có chắc muốn xoá kết bạn chứ chứ?</h2>

                                        <div className="request__function">
                                            <button 
                                                className="request__btn"
                                                onClick={() => handleUnfriend(friend.id)}
                                            >có</button>
                                            <button 
                                                className="request__btn" 
                                                onClick={() => {
                                                    setBoxRequest(false)
                                                }}
                                            >không</button>
                                        </div>
                                    </div>
                                </div>}         
                        </div>
                    )})}

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

export default FriendPage;