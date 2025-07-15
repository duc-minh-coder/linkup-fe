import { useRef, useState, useEffect } from "react";
import "./EditPostModal.scss";
import axios from "axios";
import GetApiBaseUrl from "../../../../../helpers/GetApiBaseUrl";

function EditPostModal({ handleCloseModal, userInfo, editPost = null, isEditMode = false }) {
    const [postText, setPostText] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [fileSelectedImages, setFileSelectedImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const fileInputRef = useRef();
    const submitBtnRef = useRef();

    const API_BASE_URL = GetApiBaseUrl();

    // Initialize form with existing post data when editing
    useEffect(() => {
        if (isEditMode && editPost) {
            setPostText(editPost.content || "");
            if (editPost.postMedia && editPost.postMedia.length > 0) {
                const imageUrls = editPost.postMedia.map(media => media.url);
                setSelectedImages(imageUrls);
                setExistingImages(imageUrls);
            }
        }
    }, [isEditMode, editPost]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setFileSelectedImages(prev => [...prev, ...files]);

        const imgURLs = files.map(file => {
            return URL.createObjectURL(file);
        });

        setSelectedImages(prev => [...prev, ...imgURLs]);
    };

    const handleRemoveImage = (index) => {
        const imageToRemove = selectedImages[index];
        
        // Remove from display
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        
        // If it's a new file (not existing), remove from file list
        if (!existingImages.includes(imageToRemove)) {
            const fileIndex = selectedImages.slice(0, index).filter(img => !existingImages.includes(img)).length;
            setFileSelectedImages(prev => prev.filter((_, i) => i !== fileIndex));
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("content", postText);
        
        // Add new images to formData
        fileSelectedImages.forEach(img => {
            formData.append("mediaList", img);
        });

        // For edit mode, we might need to handle existing images differently
        if (isEditMode && editPost) {
            // Add existing images that weren't removed
            const keptExistingImages = selectedImages.filter(img => existingImages.includes(img));
            keptExistingImages.forEach(img => {
                formData.append("existingImages", img);
            });
        }

        try {
            let response;

            if (isEditMode && editPost) {
                // Update existing post
                response = await axios.patch(`${API_BASE_URL}/api/posts/${editPost.id}`, 
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        },
                    }
                );
            }

            console.log(response.data);
            handleCloseModal();
        } catch(err) {
            console.log(err);
        }
        
        // Reset form
        handleCloseModal();
    };

    return (
        <>
            <div className="modal-overlay" onClick={() => handleCloseModal()}></div>
            <div className="post-edit-modal">
                <div className="post-edit-modal__header">
                    <h2>{isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết"}</h2>
                    <button className="post-edit-modal__close" onClick={() => handleCloseModal()}>
                        ×
                    </button>
                </div>

                <div className="post-edit-modal__user-info">
                    <img src={userInfo.avatarUrl} alt="User avatar" />
                    <div>
                        <div className="post-edit-modal__username">{userInfo.fullName || "Nguyễn Đức Minh"}</div>
                        <div className="post-edit-modal__privacy">Bạn bè</div>
                    </div>
                </div>

                <div className="post-edit-modal__content">
                    <textarea
                        className="post-edit-modal__textarea"
                        placeholder="Bạn đang nghĩ gì?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        rows={3}
                    />

                    {selectedImages.length > 0 && (
                        <div className="post-edit-modal__image-preview-multiple">
                            {selectedImages.map((img, index) => (
                                <div key={index} className="image-wrapper">
                                    <img src={img} alt={`Preview ${index}`} />
                                    <button 
                                        onClick={() => handleRemoveImage(index)}
                                        className="post-edit-modal__remove-image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    className="post-edit-modal__add-media"
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
                    className="post-edit-modal__submit"
                    ref={submitBtnRef}
                    onClick={handleSubmit}
                    disabled={postText.trim() === ""}
                >
                    {isEditMode ? "Cập nhật" : "Đăng"}
                </button>
            </div>
        </>
    );
}

export default EditPostModal;