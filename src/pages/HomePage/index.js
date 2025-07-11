import Feed from "./Feed";
import "./HomePage.scss";
import Friends from "./Friends";
import { useEffect, useState } from "react";
import { logout } from "../../actions/userAction";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [friends, setFriends] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const API_BASE_URL = "http://localhost:8080";

    const getPosts = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/api/posts/friend-posts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            // console.log(response.data.result);
            setPosts(response.data.result);
        }
        catch (err) {
            console.log(err);
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

            // console.log(response.data.result);
            setUserProfile(response.data.result);
        }
        catch (err) {
            console.log(err);
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

    useEffect(() => {
        getUserProfile();
        getPosts();
    }, []);

    useEffect(() => {
        if (userProfile.id) {
            getFriends();
        }
    }, [userProfile]);

    return (
        <div className="linkup-app">
            <main className="main-content">
                <Feed posts={posts} userProfile={userProfile}/>
                
                <Friends userProfile={userProfile} friends={friends} logout={handleLogout} />
            </main>
        </div>
    );
}

export default HomePage;
