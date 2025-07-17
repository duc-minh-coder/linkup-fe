import { useState, useEffect } from "react";
import { Bookmark, Loader2, RefreshCw } from "lucide-react";
import axios from "axios";
import BookmarkCard from "./BookmarkCard";
import DetailPost from "../HomePage/Feed/Post/DetailPost";
import "./BookmarkPage.scss";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";

function BookmarkPage({ userAvatar, userName }) {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const API_BASE_URL = GetApiBaseUrl();

    const test = [
        {
            "id": 12,
            "content": "Bài viết thú vị về UX",
            "updatedTime": "2025-07-17T01:23:45",
            "authorId": 3,
            "authorName": "Minh Đức",
            "authorAvatarUrl": "/images/avatars/minhduc.jpg",
            "postMedia": [
                {
                    "url": "/images/posts/ux1.jpg"
                }
            ],
            "userLikes": [5, 7, 9],        // Có thể là userId hoặc object tuỳ bạn
            "comments": []            // Tuỳ format của bạn
        },
        {
            "id": 13,
            "content": "Bài viết test",
            "updatedTime": "2025-07-17T01:23:45",
            "authorId": 3,
            "authorName": "Minh Zom",
            "authorAvatarUrl": "/images/avatars/minhduc.jpg",
            "userLikes": [5, 7, 9],        // Có thể là userId hoặc object tuỳ bạn
            "comments": []            // Tuỳ format của bạn
        }
    ]

    useEffect(() => {
        setBookmarks(test);
        // fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        
    };

    const handleUnsave = async (postId) => {
        
    };

    const handleViewDetail = (post) => {
        setSelectedPost(post);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
        setSelectedPost(null);
    };

    const handleRetry = () => {
        fetchBookmarks();
    };

    if (loading) {
        return (
            <div className="bookmark-page">
                <div className="bookmark-page__header">
                    <h1>Bài viết đã lưu</h1>
                    <div className="bookmark-page__header-info">
                        Đang tải...
                    </div>
                </div>
                <div className="bookmark-page__content">
                    <div className="bookmark-page__loading">
                        <Loader2 size={40} />
                        <p>Đang tải bài viết đã lưu...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bookmark-page">
            <div className="bookmark-page__header">
                <h1>Bài viết đã lưu</h1>
                <div className="bookmark-page__header-info">
                    {bookmarks.length > 0 
                        ? `${bookmarks.length} bài viết` 
                        : "Chưa có bài viết nào"
                    }
                </div>
            </div>

            <div className="bookmark-page__content">
                {error && (
                    <div className="bookmark-page__error">
                        <p>{error}</p>
                        <button onClick={handleRetry}>
                            <RefreshCw size={14} />
                            Thử lại
                        </button>
                    </div>
                )}

                {!error && bookmarks.length === 0 && (
                    <div className="bookmark-page__empty">
                        <Bookmark size={80} />
                        <h2>Chưa có bài viết nào được lưu</h2>
                    </div>
                )}

                {!error && bookmarks.length > 0 && (
                    <div className="bookmark-page__list">
                        {bookmarks.map((post) => (
                            <BookmarkCard
                                key={post.id}
                                post={post}
                                onViewDetail={handleViewDetail}
                                onUnsave={handleUnsave}
                                userAvatar={userAvatar}
                                userName={userName}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showDetail && selectedPost && (
                <DetailPost
                    post={selectedPost}
                    handlingShow={handleCloseDetail}
                    userAvatar={userAvatar}
                    userName={userName}
                    isAuthor={selectedPost.authorId === userName} // Adjust this logic as needed
                />
            )}
        </div>
    );
}

export default BookmarkPage;