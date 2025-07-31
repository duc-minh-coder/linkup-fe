import Feed from "./Feed";
import "./HomePage.scss";
import Friends from "./Friends";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { logout } from "../../actions/userAction";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";
import { WebsocketContext } from "../../contexts/WebsocketContext";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [friends, setFriends] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pageRef = useRef(0);
    const scrollTimeout = useRef(null);
    const [friendPage, setFriendPage] = useState(0);
    const [hasMoreFriend, setHasMoreFriend] = useState(true);

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = 5;
    const { stompCli, onlineList } = useContext(WebsocketContext);

    const loadMore = () => {
        const nextPage = friendPage + 1;
        setFriendPage(nextPage);
    }
    
    useEffect(() => {
        if (userProfile.id && friendPage !== 0) {
            getFriends(friendPage);
        }
    }, [friendPage]);


    const getPosts = async (pageNumber = 0, initial = false) => {
        const token = localStorage.getItem("token");

        if (!token) return;

        if (loadingPosts || !hasMore) return;

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
            

            if (initial) {
                pageRef.current = 1;
                setPosts(newPosts);
            }
            else {
                pageRef.current += 1;
                setPosts(prevPosts => [...prevPosts, ...newPosts])
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
            const response = await axios.get(`${API_BASE_URL}/api/friendships/friend/${userProfile.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }, params: {
                    page: friendPage,
                    size: PAGE_SIZE
                }
            })

            const newFriends = response.data.result;
            

            if (friendPage === 0) {
                setFriends(newFriends);
            } else {
                setFriends(prev => [...prev, ...newFriends]);
            }

            if (newFriends.length < PAGE_SIZE) {
                setHasMoreFriend(false);
            }
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
        if (scrollTimeout.current) return;

        scrollTimeout.current = setTimeout(() => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;

            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

            if (scrollPercentage >= 0.95 && !loadingPosts && hasMore) {
                // console.log(pageRef.current);
                getPosts(pageRef.current, false);
            }

            scrollTimeout.current = null;
        }, 200);
    }, [loadingPosts, hasMore]);

    useEffect(() => {
        window.addEventListener("scroll", handlingScrollPage);

        return () => 
            window.removeEventListener("scroll", handlingScrollPage);
    }, [handlingScrollPage])

    useEffect(() => {
        getUserProfile();
        setPosts([]);
        pageRef.current = 0;
        getPosts(0, true);
    }, []);

    useEffect(() => {
        if (!userProfile.id) return;

        getFriends();
    }, [userProfile?.id]);

    return (
        <div className="linkup-app">
            <main className="main-content">
                {!loadingProfile && (
                    <>
                        <div className="main-content__feed">
                            <Feed posts={posts} userProfile={userProfile} onlineList={onlineList}/>

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
                        
                        <Friends 
                            userProfile={userProfile} 
                            friends={friends} 
                            logout={handleLogout} 
                            loadMore={loadMore} 
                            hasMoreFriend={hasMoreFriend}
                            onlineList={onlineList}
                        />
                    </>
                )}

            </main>
        </div>
    );
}

export default HomePage;
