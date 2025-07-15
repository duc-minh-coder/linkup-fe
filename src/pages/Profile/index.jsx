import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.scss";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import Feed from "../HomePage/Feed/index.jsx";
import EditProfile from "./EditProfile/index.jsx";
import { toast } from "react-toastify";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl/index.jsx";

function Profile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [posts, setPosts] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [userExisted, setUserExisted] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [page, setPage] = useState(0);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const handleSave = async (fullName, bio) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(`http://localhost:8080/api/profiles/update-profile`, {
                fullName: fullName,
                bio: bio
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log(response.data.result);
            setShowEditModal(false);
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
        }
    };

    const handlingOpenEditProfileComponent = () => {
        setShowEditModal(true);
    }

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = 5;

    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_BASE_URL}/api/profiles/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            const isOwner = await axios.get(`${API_BASE_URL}/api/users/check-owner/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            setIsOwner(isOwner.data.result);
            console.log(response.data.result);

            if (response.data.result) {
                setUserExisted(true);
                setUserInfo(response.data.result);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    
    const getPosts = async (page = 0, initial = false) => {
        const token = localStorage.getItem("token");

        if (!token || loadingPosts) return;

        setLoadingPosts(true);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    page: page,
                    size: PAGE_SIZE
                }
            })
            const newPosts = response.data.result;

            if (initial) {
                setPosts(newPosts);
                setPage(0);
            } 
            else {
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
                setPage(prevPage => prevPage + 1);
            }
                
            if (newPosts.length < PAGE_SIZE) 
                setHasMore(false);
            else 
                setHasMore(true);
        }
        catch (err) {
            console.log(err);
            setHasMore(false);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleFriend = async () => {
        const token = localStorage.getItem("token");

        switch (userInfo.friendshipStatus) {
            case "FRIEND":
                await axios.delete(`${API_BASE_URL}/api/friendships/delete`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }, params: {
                        friendId: userInfo.id
                    }
                }).then(() => {
                    toast.success(`đã xoá kết bạn với ${userInfo.fullName}`);

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000)
                }).catch(() => {
                    toast.error(`lỗi không xoá được kết bạn`);
                })
                break;
            case "REQUEST_SENT":
                await axios.post(`${API_BASE_URL}/api/friendships/handling`, {
                    otherUserId: userInfo.id,
                    status: "NOT_FRIEND"
                },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }).then(() => {
                    toast.success("đã huỷ gửi lời mời");

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000)
                }).catch(() => {
                    toast.error("không thể huỷ gửi lời mời");
                })
                break;
            case "REQUEST_RECEIVED":
                await axios.post(`${API_BASE_URL}/api/friendships/handling`, {
                    otherUserId: userInfo.id,
                    status: "FRIEND"
                },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }).then(() => {
                    toast.success(`đã kết bạn với ${userInfo.fullName}`);

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000)
                }).catch(() => {
                    toast.error(`lỗi không kết bạn được`);
                })
                break;
            default:
                await axios.post(`${API_BASE_URL}/api/friendships/send`, {
                    otherUserId: userInfo.id,
                    status: "REQUEST_SENT"
                },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }).then(() => {
                    toast.success("đã gửi lời mời kết bạn");

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000)
                }).catch(() => {
                    toast.error("không thể gửi lời mời");
                })
                break;
        }
    }

    const handleNotAccept = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.post(`${API_BASE_URL}/api/friendships/handling`, {
                otherUserId: userInfo.id,
                status: "NOT_FRIEND"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(() => {
                toast.success("đã từ chối lời mời kết bạn");

                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            }).catch(() => {
                toast.error("không thể từ chối lời mời");
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handlingScrollPage = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        // phần trăm cuận đc
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        
        if (scrollPercentage < 0.95 || loadingPosts || !hasMore) {
            return;
        }

        getPosts(page + 1, false);
    }, [page, loadingPosts, hasMore]);

    useEffect(() => {
        window.addEventListener("scroll", handlingScrollPage);

        console.log(posts)
        return () => 
            window.removeEventListener("scroll", handlingScrollPage);
    }, [handlingScrollPage])

    useEffect(() => {
        getUser();
    }, [userId]);

    useEffect(() => {
        if (userExisted) {
            setPosts([]);
            getPosts(0, true);
        }
    }, [userExisted, userId]);

    return (
        <>
            {
                userExisted ? 
                <div className="profile">
                    <ProfileHeader />

                    <ProfileInfo 
                        userInfo={userInfo} 
                        isOwner={isOwner} 
                        handlingOpenEditProfileComponent={handlingOpenEditProfileComponent} 
                        handleFriend={handleFriend}
                        handleNotAccept={handleNotAccept}
                    />

                    <div className="profile__post-content">
                        <Feed posts={posts} userProfile={userInfo} />
                    </div>
                </div> : 
                <div className="user-not-existed">người dùng không tồn tại!</div>
            }

            {showEditModal && (
                <EditProfile
                userInfo={userInfo}
                onClose={() => setShowEditModal(false)}
                onSave={handleSave}
                />
            )}
        </>
    )
}

export default Profile;