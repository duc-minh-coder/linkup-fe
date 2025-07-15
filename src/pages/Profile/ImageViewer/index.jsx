import { useRef } from "react";
import "./ImageViewer.scss";
import { X } from "lucide-react";
import axios from "axios";
import GetApiBaseUrl from "../../../helpers/GetApiBaseUrl";

function ImageViewer({ isOwner, images, onClose }) {
  const fileInputRef = useRef();
  const API_BASE_URL = GetApiBaseUrl();

  const handlingAddAvatar = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");

    try {
      axios
        .post(`${API_BASE_URL}/api/profiles/update-avatar`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          alert("đã thay thành công ảnh đại diện");
          onClose();

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(() => {
          alert("lỗi chưa thể thay được ảnh đại diện");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="image-viewer">
      <div className="box-overlay" onClick={() => onClose()}></div>
      <div className="image-viewer__content">
        <button className="close-btn" onClick={onClose}>
          <X size={30} />
        </button>

        <img src={images} alt="avt" />
        {isOwner && (
          <div>
            <button
              className="add-avatar"
              onClick={() => fileInputRef.current?.click()}
            >
              Thêm mới avatar
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlingAddAvatar}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageViewer;
