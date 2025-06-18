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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Home() {
    // Sample post data
    const posts = [
        {
            id: 1,
            author: "Nguyễn Đức Minh",
            avatar: avt,
            date: "13/8/2005 04:04",
            content: "Happy birthday!",
            image: imgFake,
            likes: 1975,
            comments: 99
        },
        {
            id: 2,
            author: "Nguyễn Đức Minh",
            avatar: avt,
            date: "30/02/2025 04:04",
            content: "hello world",
            image: null,
            likes: 1,
            comments: 0
        },
        {
            id: 3,
            author: "Nguyễn Đức Minh",
            avatar: avt,
            date: "13/8/2005 04:04",
            content: "Happy birthday!",
            image: imgFake,
            likes: 1975,
            comments: 99
        }
    ];

    // Active friends data
    const activeFriends = [
        { id: 1, name: "Nguyễn Đức Minh", avatar: avt },
        { id: 2, name: "Nguyễn Đức Bình", avatar: avt },
        { id: 3, name: "Nguyễn Văn Mạnh", avatar: avt },
        { id: 4, name: "Nguyễn Văn Nam", avatar: avt },
        { id: 5, name: "Nguyễn Thị A", avatar: avt },
    ];

    return (
        <div className="home-container">
            <div className="sidebar">
                <Sidebar 
                    userAvatar={avt} 
                    userName="Nguyễn Đức Minh" 
                />
            </div>
            
            
            <main className="main-content">
                <PostCreator userAvatar={avt} />
                <PostList posts={posts} />
            </main>
            
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