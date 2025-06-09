import "./PostCreator.scss";
import { useState, useRef, useEffect } from "react";
import { 
    LiveIcon,
    VideoIcon,
    CloseIcon
} from "../../../../components/assetsConvert.js";

function PostCreator({ userAvatar }) {
    const [showModal, setShowModal] = useState(false);
    const [postText, setPostText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef();
    const submitBtnRef = useRef();

    useEffect(() => {
        if (submitBtnRef.current) {
            submitBtnRef.current.disabled = postText.trim() === "";
        }
    }, [postText]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        // Handle post submission logic here
        console.log("Post submitted:", { text: postText, image: selectedImage });
        
        // Reset form
        setPostText("");
        setSelectedImage(null);
        setShowModal(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPostText("");
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <div className="post-creator">
                <div className="post-creator__input-section">
                    <img src={userAvatar} alt="User avatar" className="post-creator__avatar" />
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
                                rows={4}
                            />

                            {selectedImage && (
                                <div className="post-modal__image-preview">
                                    <img src={selectedImage} alt="Preview" />
                                    <button 
                                        className="post-modal__remove-image"
                                        onClick={() => {
                                            setSelectedImage(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                    >
                                        ×
                                    </button>
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
                            style={{ display: 'none' }}
                        />

                        <button 
                            className="post-modal__submit"
                            ref={submitBtnRef}
                            onClick={handleSubmit}
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