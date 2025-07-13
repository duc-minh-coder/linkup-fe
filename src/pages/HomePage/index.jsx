import Feed from "./Feed";
import "./HomePage.scss";
import Friends from "./Friends";
import { useCallback, useEffect, useState } from "react";
import { logout } from "../../actions/userAction";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [friends, setFriends] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const API_BASE_URL = "http://localhost:8080";

    const getPosts = async (pageNumber = 0, initial = false) => {
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
                    page: pageNumber,
                    size: 5
                }
            })
            // setPosts(response.data.result);
            const newPosts = response.data.result;

            if (initial) 
                setPosts(newPosts);
            else 
                setPosts(prevPosts => [...prevPosts, ...newPosts])

            if (newPosts.length < 5) 
                setHasMore(false);
            
            setPageNumber(pageNumber);
        }
        catch (err) {
            console.log(err);
        } finally {
            setLoadingPosts(false);
        }
    };

    const getUserProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/api/profiles/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            setUserProfile(response.data.result);
            setLoadingProfile(false);
        }
        catch (err) {
            console.log(err);
            setLoadingProfile(false);
        }
    }

    const getFriends = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/api/friendships/user/${userProfile.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            // console.log(response.data.result);
            setFriends(response.data.result);
        }
        catch (err) {
            console.log(err);
        }
    }

    
    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        dispatch(logout(token));
        const tokenLogout = "";
        localStorage.setItem("token", tokenLogout);

        if (!token) navigate("/signin");
    };

    // xử lí khi quận trang
    const handlingScrollPage = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingPosts || !hasMore) {
            return;
        }
        
        // Load thêm bài viết khi scroll đến cuối trang
        getPosts(pageNumber + 1);
    }, [pageNumber, loadingPosts, hasMore]);

    useEffect(() => {
        window.addEventListener("scroll", handlingScrollPage);

        return () => 
            window.removeEventListener("scroll", handlingScrollPage);
    }, [handlingScrollPage])

    useEffect(() => {
        getUserProfile();
        getPosts(0, true);
    }, []);

    useEffect(() => {
        if (userProfile.id) {
            getFriends();
        }
    }, [userProfile]);

    return (
        <div className="linkup-app">
            <main className="main-content">
                {!loadingProfile && (
                    <>
                        <Feed posts={posts} userProfile={userProfile}/>
            
                        <Friends userProfile={userProfile} friends={friends} logout={handleLogout} />
                    </>
                )}

                {/* {loadingPosts && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '20px',
                        color: '#666'
                    }}>
                        Đang tải thêm bài viết...
                    </div>
                )}
                
                {!hasMore && posts.length > 0 && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '20px',
                        color: '#999'
                    }}>
                        Đã hiển thị hết tất cả bài viết
                    </div>
                )} */}
            </main>
        </div>
    );
}

export default HomePage;
