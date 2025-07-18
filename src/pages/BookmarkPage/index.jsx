import { useState, useEffect } from "react";
import { Bookmark, Loader2, RefreshCw } from "lucide-react";
import axios from "axios";
import BookmarkCard from "./BookmarkCard";
import DetailPost from "../HomePage/Feed/Post/DetailPost";
import "./BookmarkPage.scss";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";
import { toast } from "react-toastify";

function BookmarkPage() {
    const [userProfile, setUserProfile] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [init, setInit] = useState(false);

    const API_BASE_URL = GetApiBaseUrl();
    const PAGE_SIZE = "2";

    useEffect(() => {
        getUserProfile();
    }, [])

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

            setInit(true);
            setPage(0);
            fetchBookmarks(0);
        }
        catch (err) {
            console.log(err);
            setLoadingProfile(false);
        }
    }

    const fetchBookmarks = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            axios.get(`${API_BASE_URL}/api/bookmarks/list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }, params: {
                    page: page,
                    size: PAGE_SIZE
                }
            }).then(res => {
                const data = res.data.result;

                if (init) {
                    setBookmarks(data);
                    setPage(prev => prev + 1);
                    setInit(false);
                }
                else {
                    setBookmarks(prev => [...prev, ...data]);
                    setPage(prev => prev + 1);
                }

                if (bookmarks.length < PAGE_SIZE) {
                    setHasMore(false);
                }
            }).catch(() => {
                toast.error("lỗi chưa lấy đc bài viết đã lưu");
            })
        } catch (error) {
            console.log(error);
        }
    };

    const showMore = () => {

    }

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
                        {bookmarks.map((post, index) => (
                            <BookmarkCard
                                key={index}
                                post={post.postResponse}
                                onViewDetail={handleViewDetail}
                                onUnsave={handleUnsave}
                                userAvatar={post.authorAvatarUrl}
                                userName={post.authorName}
                            />
                        ))}
                    </div>
                )}

                {hasMore && bookmarks.length < 0 &&
                    <div className="show-more">
                        xem thêm
                    </div>
                }
            </div>

            {showDetail && selectedPost && (
                <DetailPost
                    post={selectedPost}
                    handlingShow={handleCloseDetail}
                    userAvatar={userProfile.avatarUrl}
                    userName={userProfile.fullName}
                    isAuthor={selectedPost.authorId === userProfile.id} // Adjust this logic as needed
                />
            )}
        </div>
    );
}

export default BookmarkPage;