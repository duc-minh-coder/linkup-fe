import Feed from "./Feed";
import "./HomePage.scss";
import Friends from "./Friends";
import { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [userProfile, setUserProfile] = useState({});

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

            console.log(response.data.result);
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

            console.log(response.data.result);
            setUserProfile(response.data.result);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUserProfile();
        getPosts();
    }, []);

    return (
        <div className="linkup-app">
            <main className="main-content">
                <Feed posts={posts}/>
                
                <Friends userProfile={userProfile} />
            </main>
        </div>
    );
}

export default HomePage;
