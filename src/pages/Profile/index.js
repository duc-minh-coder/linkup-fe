import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.scss";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import Feed from "../HomePage/Feed/index.js";
import EditProfile from "./EditProfile/index.js";

function Profile() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [posts, setPosts] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [userExisted, setUserExisted] = useState(false);
    const [addFriend, setAddFriend] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [localInfo, setLocalInfo] = useState(userInfo); // để cập nhật tức thì

    const handleSave = async (updatedData) => {
        try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:8080/api/profiles/update`, updatedData, {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            }
        });
        setLocalInfo(prev => ({ ...prev, ...updatedData }));
        setShowEditModal(false);
        } catch (error) {
        console.error("Lỗi khi lưu:", error);
        }
    };

    const handlingOpenEditProfileComponent = () => {
        setShowEditModal(true);
    }


    const API_BASE_URL = "http://localhost:8080";

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
                getAllPostByUser();
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    
    const getAllPostByUser = async () => {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/api/posts/user/${userId}`, {
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
                        <Feed posts={posts} />
                    </div>
                </div> 
                : <div className="user-not-existed">người dùng không tồn tại!</div>
            }

            {showEditModal && (
                <EditProfile
                userInfo={localInfo}
                onClose={() => setShowEditModal(false)}
                onSave={handleSave}
                />
            )}
        </>
    )
}

export default Profile;