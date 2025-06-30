import "./PostCreator.scss";
import { useState, useRef, useEffect } from "react";
import { 
    LiveIcon,
    VideoIcon,
    CloseIcon
} from "../../../../components/assetsConvert.js";
import PostItem from "../PostList/PostItem/index.js";
import axios from "axios";

function PostCreator({ userAvatar }) {
    const [showModal, setShowModal] = useState(false);
    const [postText, setPostText] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [fileSelectedImages, setFileSelectedImages] = useState([]);
    const fileInputRef = useRef();
    const submitBtnRef = useRef();
    const [showNewUserPost, setShowUserPost] = useState(false);
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (submitBtnRef.current) {
            submitBtnRef.current.disabled = postText.trim() === "";
        }
    }, [postText]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setFileSelectedImages(files);

        const imgURLs = files.map(file => {
            return URL.createObjectURL(file);
        })

        setSelectedImages(prev => [...prev, ...imgURLs]);
    };

    const handleSubmit = async () => {
        // Handle post submission logic here
        console.log("Post submitted:", { text: postText, image: selectedImages });

        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("content", postText);
        fileSelectedImages.map(img => {
            formData.append("mediaList", img)
        })

        try {
            const response = await axios.post("http://localhost:8080/api/posts", 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )

            console.log(response.data);
            setPost(response.data);
            setShowUserPost(true);
        }
        catch(err) {
            console.log(err);
        }
        
        // Reset form
        setPostText("");
        setSelectedImages([]);
        setShowModal(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPostText("");
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <div className="post-creator">
                <div className="post-creator__input-section">
                    {(userAvatar) && <img src={userAvatar} alt="User avatar" className="post-creator__avatar" />}
                    <button 
                        className="post-creator__input"
                        onClick={() => setShowModal(true)}
                    >
                        Bạn đang nghĩ gì?
                    </button>
                </div>

                <div className="post-creator__actions">
                    <button className="post-creator__action-btn post-creator__action-btn--live">
                        <LiveIcon />
                        <span>Trực tiếp</span>
                    </button>
                    <button 
                        className="post-creator__action-btn post-creator__action-btn--media"
                        onClick={() => setShowModal(true)}
                    >
                        <VideoIcon />
                        <span>Ảnh/Video</span>
                    </button>
                </div>
            </div>

            {showNewUserPost && (
                <>
                    <PostItem post={post}/>
                </>
            )}

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal-overlay" onClick={handleCloseModal}></div>
                    <div className="post-modal">
                        <div className="post-modal__header">
                            <h2>Tạo bài viết</h2>
                            <button className="post-modal__close" onClick={handleCloseModal}>
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="post-modal__user-info">
                            <img src={userAvatar} alt="User avatar" />
                            <div>
                                <div className="post-modal__username">Nguyễn Đức Minh</div>
                                <div className="post-modal__privacy">Bạn bè</div>
                            </div>
                        </div>

                        <div className="post-modal__content">
                            <textarea
                                className="post-modal__textarea"
                                placeholder="Bạn đang nghĩ gì?"
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                rows={3}
                            />

                            {selectedImages.length > 0 && (
                                <div className="post-modal__image-preview-multiple">
                                    {
                                        selectedImages.map((img, index) => (
                                            <div key={index} className="image-wrapper">
                                                <img src={img} alt={`Preview ${index}`} />
                                                <button 
                                                    onClick={() => {
                                                        setSelectedImages(selectedImages.filter((_, i) => i !== index));
                                                    }}
                                                >×</button>
                                            </div>
                                        ))
                                    }
                                    
                                </div>
                            )}
                        </div>

                        <button 
                            className="post-modal__add-media"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            📷 Thêm ảnh/video
                        </button>

                        <input
                            type="file"
                            accept="image/*,video/*"
                            ref={fileInputRef}
                            onChange={handleImageChange} 
                            multiple
                            style={{ display: 'none' }}
                        />

                        <button 
                            className="post-modal__submit"
                            ref={submitBtnRef}
                            onClick={handleSubmit}
                            disabled={postText.trim() === ""}
                        >
                            Đăng
                        </button>
                    </div>
                </>
            )}
        </>
    );
}

export default PostCreator;