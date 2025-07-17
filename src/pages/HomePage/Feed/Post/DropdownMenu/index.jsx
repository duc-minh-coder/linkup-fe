import { useEffect, useRef, useState } from "react";
import { Edit, Delete, EyeOff } from "lucide-react";
import "./DropdownMenu.scss";

function DropdownMenu({ isAuthor, handleEditPost, handleDeletePost, handleHidePost, handlingSetDropdown }) {
    const dropdownRef = useRef(null);
    const [boxDelete, setBoxDelete] = useState(false);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handlingSetDropdown();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="post__dropdown" ref={dropdownRef}>
            {isAuthor ? (
                <>
                    <button 
                        className="post__dropdown-item"
                        onClick={handleEditPost}
                    >
                        <Edit size={16} />
                        Chỉnh sửa bài viết
                    </button>
                    <button 
                        className="post__dropdown-item"
                        onClick={() => setBoxDelete(true)}
                    >
                        <Delete size={16} />
                        Xoá bài viết
                    </button>
                </>
                
            ) : (
                <button 
                    className="post__dropdown-item"
                    onClick={handleHidePost}
                >
                    <EyeOff size={16} />
                    Ẩn bài viết
                </button>
            )}

            {
                boxDelete && 
                    <div className="box-request">
                        <div className="overlay" onClick={() => setBoxDelete(false)}></div>

                        <div className="request">
                            <h2>bạn có chắc muốn xoá bài viết chứ?</h2>

                            <div className="request__function">
                                <button 
                                    className="request__btn"
                                    onClick={() => handleDeletePost()}
                                >có</button>
                                <button 
                                    className="request__btn" 
                                    onClick={() => {
                                        setBoxDelete(false)
                                    }}
                                >không</button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}

export default DropdownMenu;