import Feed from "./Feed";
import "./HomePage.scss";
import Friends from "./Friends";
import { useCallback, useEffect, useState } from "react";
import { logout } from "../../actions/userAction";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";

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

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = 5;

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
                setPageNumber(prevPage => prevPage + 1);
        }
        catch (err) {
            console.log(err);
            setHasMore(false);
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

        navigate("/signin");
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

        getPosts(pageNumber + 1, false);
    }, [pageNumber, loadingPosts, hasMore]);

    useEffect(() => {
        window.addEventListener("scroll", handlingScrollPage);

        console.log(hasMore, posts)

        return () => 
            window.removeEventListener("scroll", handlingScrollPage);
    }, [handlingScrollPage])

    useEffect(() => {
        getUserProfile();
        setPosts([]);
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
                        <div className="main-content__feed">
                            <Feed posts={posts} userProfile={userProfile}/>

                            {loadingPosts && (
                                <div className="box-bottom">
                                    Đang tải thêm bài viết...
                                </div>
                            )}
                            
                            {!hasMore && posts.length > 0 && (
                                <div className="box-bottom">
                                    Đã hiển thị hết tất cả bài viết
                                </div>
                            )}
                        </div>
                        
                        <Friends userProfile={userProfile} friends={friends} logout={handleLogout} />
                    </>
                )}

            </main>
        </div>
    );
}

export default HomePage;
