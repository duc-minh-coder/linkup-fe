import { useEffect, useRef } from "react";
import { Edit, Delete, EyeOff } from "lucide-react";

function DropdownMenu({ isAuthor, handleEditPost, handleDeletePost, handleHidePost, handlingSetDropdown }) {
    const dropdownRef = useRef(null);

    
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
                        onClick={handleDeletePost}
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
        </div>
    );
}

export default DropdownMenu;