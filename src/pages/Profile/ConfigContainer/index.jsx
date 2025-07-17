import { useEffect, useRef, useState } from "react";
import "./ConfigContainer.scss";
import axios from "axios";
import GetApiBaseUrl from "../../../helpers/GetApiBaseUrl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ConfigContainer({ isOwner, handlingCloseConfig, handleLogout, handleDeleteAccount }) {
    const dropdownRef = useRef(null);
    const [boxRequest, setBoxRequest] = useState(false);
    const [boxChangePassword, setBoxChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const navigate = useNavigate();

    const API_BASE_URL = GetApiBaseUrl();

    const isPasswordValid = (pass) => {
        const hasLetter = /[a-zA-Z]/.test(pass); 
        const hasNumber = /[0-9]/.test(pass);
        return hasLetter && hasNumber;
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handlingCloseConfig();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPass) {
            toast.error("mật khẩu xác nhận không chính xác");
            return;
        }

        if (!isPasswordValid(newPassword)) {
                toast.warning("mật khẩu phải chứa chữ và số");
                return;
            }

        const token = localStorage.getItem('token');

        try {
            await axios.post(`${API_BASE_URL}/api/users/update-password`, {
                oldPassword: oldPassword,
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(() => {
                toast.success("đổi mật khẩu thành công!");

                setBoxChangePassword(false);
                
                navigate("/signin");
            }).catch((error) => {
                console.log(error.response.data);
                
                toast.error(error.response.data.message);
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="config" ref={dropdownRef}>
                {isOwner ? (
                    <>
                        <button 
                            className="config__item"
                            onClick={() => handleLogout()}
                        >Đăng xuất
                        </button>
                        <button 
                            className="config__item"
                            onClick={() => setBoxChangePassword(true)}
                        >Đổi mật khẩu</button>
                        <button 
                            className="config__item"
                            onClick={() => setBoxRequest(true)}
                        >Xoá tài khoản
                        </button>

                        {boxChangePassword && 
                            <div className="box-change-pass">
                                <div className="overlay" onClick={() => setBoxChangePassword(false)}></div>

                                <div className="request">
                                    <h2>Đổi mật khẩu</h2>

                                    <div className="request__change-box">
                                        <input 
                                            className="request__input" 
                                            type="password"
                                            placeholder="Mật khẩu hiện tại" 
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                        <input 
                                            className="request__input" 
                                            type="password"
                                            placeholder="Mật khẩu mới" 
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <input 
                                            className="request__input" 
                                            type="password"
                                            placeholder="Xác nhận mật khẩu mới" 
                                            onChange={(e) => setConfirmPass(e.target.value)}
                                        />
                                    </div>

                                    <div className="request__function">
                                        <button 
                                            className="request__btn" 
                                            onClick={handleChangePassword}
                                        >Xác nhận</button>
                                        <button 
                                            className="request__btn" 
                                            onClick={() => setBoxChangePassword(false)}
                                        >Huỷ</button>
                                    </div>
                                </div>
                            </div>}

                        {boxRequest && 
                            <div className="box-request">
                                <div className="overlay"></div>

                                <div className="request">
                                    <h2>bạn có chắc muốn xoá tài khoản?</h2>

                                    <div className="request__function">
                                        <button 
                                            className="request__btn"
                                            onClick={() => handleDeleteAccount()}
                                        >có</button>
                                        <button 
                                            className="request__btn" 
                                            onClick={() => {
                                                setBoxRequest(false)
                                                handlingCloseConfig()
                                            }}
                                        >không</button>
                                    </div>
                                </div>
                            </div>}
                    </>
                    
                ) : (
                    <button 
                        className="config__item"
                    >Chặn người này
                    </button>
                )}
            </div>
        </>
    );
}

export default ConfigContainer;