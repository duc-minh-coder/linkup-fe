// Home/index.js
import "./Home.scss";
import avt from "../../assets/images/avtmacdinh.png";
import imgFake from "../../assets/images/kcotime.jpg";
import { useEffect, useState, useRef } from "react";
import FetchApi from "../../helpers/FetchApi/index.js";

// Import components
import Sidebar from "./components/SideBar/index.js";
import PostCreator from "./components/PostCreator/index.js";
import PostList from "./components/PostList/index.js";
import ActiveFriends from "./components/ActiveFriends/index.js";
import axios from "axios";

function Home() {
    const [posts, setPosts] = useState([]);
    const [activeFriends, setActiveFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getFriendPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");

            if (!token) {
                setError("không tìm thấy token");
                return;
            }

            const response = await axios.get("http://localhost:8080/api/posts/friend-posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data)
            setPosts(response.data.result);


        }
        catch(err) {
            console.log(err);
        }  
    }

    const getListFriend = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("không tìm thấy token");
                return;
            }

            const response = await axios.get("http://localhost:8080/api/friendships", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data.result);
            setActiveFriends(response.data.result)
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getFriendPosts();
        getListFriend();
    }, [])



    return (
        <div className="home-container">
            <div className="sidebar">
                <Sidebar 
                    userAvatar={avt} 
                    userName="Nguyễn Đức Minh" 
                />
            </div>
            
            {/* Hiển thị trạng thái loading */}
            {!loading && (
                <div className="loading-container">
                    <p>Đang tải bài đăng...</p>
                </div>
            )}
            {loading && !error && (
                <main className="main-content">
                    <PostCreator userAvatar={avt} />
                    <PostList posts={posts} />
                </main>
            )}
            
            <div className="active-friends">
                <ActiveFriends 
                    activeFriends={activeFriends} 
                    // onFriendClick={handleFriendClick}
                />
            </div>
            
        </div>
    );
}

export default Home;