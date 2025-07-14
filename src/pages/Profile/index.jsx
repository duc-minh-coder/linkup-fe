import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.scss";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import Feed from "../HomePage/Feed/index.jsx";
import EditProfile from "./EditProfile/index.jsx";

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

    const API_BASE_URL = "http://localhost:8080";
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
                getPosts();
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    
    const getPosts = async (page = 0, initial = false) => {
        const token = localStorage.getItem("token");

        if (!token) return;

        if (loadingPosts) return;

        setLoadingPosts(true);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts/all-post`, {
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

            if (initial) 
                setPosts(newPosts);
            else 
                setPosts(prevPosts => [...prevPosts, ...newPosts])

            if (newPosts.length < PAGE_SIZE) 
                setHasMore(false);
            else 
                setHasMore(true);

            if (!initial) 
                setPage(page);
        }
        catch (err) {
            console.log(err);
            setHasMore(false);
        } finally {
            setLoadingPosts(false);
        }
    };

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

        console.log(hasMore, posts)

        return () => 
            window.removeEventListener("scroll", handlingScrollPage);
    }, [handlingScrollPage])
    

    useEffect(() => {
        getUser();
    }, []);

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