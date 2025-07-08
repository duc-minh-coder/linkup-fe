import { useState } from "react";
import "./EditProfile.scss";

function EditProfile({ userInfo, onClose, onSave }) {
    const [formData, setFormData] = useState({
        fullName: userInfo.fullName || "",
        location: userInfo.location || "",
        bio: userInfo.bio || "",
        birthday: userInfo.birthday || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="edit-profile">
            <div className="modal-content">
                <h2>Chỉnh sửa trang cá nhân</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tên:
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="..." />
                    </label>
                    <label>
                        Địa chỉ:
                        <input type="text" name="location" value={formData.location} onChange={handleChange} />
                    </label>
                    <label>
                        Tiểu sử:
                        <textarea name="bio" value={formData.bio} onChange={handleChange} />
                    </label>
                    <label>
                        Ngày sinh:
                        <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
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
