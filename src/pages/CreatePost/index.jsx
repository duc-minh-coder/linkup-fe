import { useRef, useState } from "react";
import "./CreatePost.scss";
import axios from "axios";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";

function CreatePost({ handleCloseModal, userInfo }) {
    const [postText, setPostText] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [fileSelectedImages, setFileSelectedImages] = useState([]);
    const fileInputRef = useRef();
    const submitBtnRef = useRef();
    const [post, setPost] = useState(null);

    const API_BASE_URL = GetApiBaseUrl();

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
            const response = await axios.post(`${API_BASE_URL}/api/posts`, 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            )

            console.log(response.data);
            setPost(response.data);
            handleCloseModal();
        }
        catch(err) {
            console.log(err);
        }
        
        // Reset form
        handleCloseModal();
    };

    return (
        <>
            <div className="modal-overlay" onClick={() => handleCloseModal()}></div>
            <div className="post-modal">
                <div className="post-modal__header">
                    <h2>Tạo bài viết</h2>
                    <button className="post-modal__close" onClick={() => handleCloseModal()}>
                        x
                    </button>
                </div>

                <div className="post-modal__user-info">
                    <img src={userInfo.avatarUrl} alt="User avatar" />
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
    );
}

export default CreatePost;