import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.scss";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import PostList from "../Home/components/PostList/index.js";
import Feed from "../HomePage/Feed/index.js";

function Profile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [posts, setPosts] = useState([]);

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`${API_BASE_URL}/api/profiles/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            console.log(response.data.result);
            setUserInfo(response.data.result);
        }
        catch (err) {
            console.log(err);
        }
    }
    
    const getAllUrPost = async () => {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/api/posts/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        console.log(response.data.result);
        setPosts(response.data.result);
    }

    useEffect(() => {
        getUser();
        getAllUrPost();
    }, []);

    return (
        <div className="profile">
            <ProfileHeader />
            <ProfileInfo userInfo={userInfo} isOwnProfile={true} />
            <div className="profile__post-content">
                <Feed posts={posts} />
            </div>
            
        </div>
    )
}

export default Profile;