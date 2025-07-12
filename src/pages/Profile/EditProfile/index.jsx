import { useEffect, useState } from "react";
import "./EditProfile.scss";
import useDebounce from "../../../hooks/useDebounce";

function EditProfile({ userInfo, onClose, onSave }) {
    const [bio, setBio] = useState(userInfo.bio);
    const [name, setName] = useState(userInfo.fullName);
    const debounceBio = useDebounce(bio, 500);
    const debounceName = useDebounce(name, 500);

    const handleChangeName = (e) => {
        setName(e.target.value)
    };

    const handleChangeBio = (e) => {
        setBio(e.target.value)
    }

    // useEffect(() => {
        
    // }, [debounceBio, debounceName])

    const handleSubmit = (e) => {
        e.preventDefault();
        
        onSave(debounceName, debounceBio);
        onClose();
    };

    return (
        <div className="edit-profile">
            <div className="modal-content">
                <h2>Chỉnh sửa trang cá nhân</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tên:
                        <input 
                            type="text" 
                            name="fullName" 
                            onChange={handleChangeName} 
                            placeholder="tên phải có 8 kí tự"
                        />
                    </label>
                    <label>
                        Tiểu sử:
                        <textarea 
                            name="bio" 
                            onChange={handleChangeBio} 
                            placeholder={userInfo.bio}
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit">Lưu</button>
                        <button type="button" onClick={onClose}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
