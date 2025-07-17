import './signup.scss';
import userIcon from '../../assets/icon/userIcon.png';
import passIcon from '../../assets/icon/passIcon.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import GetApiBaseUrl from '../../helpers/GetApiBaseUrl';
import { toast } from 'react-toastify';

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const API_BASE_URL = GetApiBaseUrl();

    const isPasswordValid = (pass) => {
        const hasLetter = /[a-zA-Z]/.test(pass); 
        const hasNumber = /[0-9]/.test(pass);
        return hasLetter && hasNumber;
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (username.length < 8) {
            toast.warning("tên tài khoản phải có đủ 8 kí tự.");
            return;
        }

        if (password == confirmPassword) {

            if (password.length < 8) {
                toast.warning("mật khẩu phải chứa 8 kí tự gồm số và chữ");
                return;
            }

            if (!isPasswordValid(password)) {
                toast.warning("mật khẩu phải chứa chữ và số");
                return;
            }

            try {
                await axios.post(`${API_BASE_URL}/api/users`, {
                    username: username,
                    password: password,
                    fullName: fullName
                });
    
                navigate('/signin');
            }
            catch(err) {
                toast.error('Đăng kí thất bại: ' + err.response?.data?.message || 'Lỗi không xác định');
            }
        }
        else toast.error("mật khẩu nhập lại không đúng");
    };

    return (
        <div className="sign-up">
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="form__title">Đăng ký</h2>

                <div className="form__box">
                    <img src={userIcon} className="form__img" alt="User Icon"/>
                    <input 
                        className="form__input" 
                        type="text" 
                        placeholder="Tên người dùng" 
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                </div>

                <div className="form__box">
                    <img src={passIcon} className="form__img" alt="Password Icon"/>
                    <input 
                        className="form__input" 
                        type="password" 
                        placeholder="Mật khẩu" 
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>

                <div className="form__box">
                    <img src={passIcon} className="form__img" alt="Confirm Password Icon"/>
                    <input 
                        className="form__input" 
                        type="password" 
                        placeholder="Xác nhận mật khẩu" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                </div>

                <div className="form__box">
                    <img src={userIcon} className="form__img" alt="fullname Icon"/>
                    <input 
                        className="form__input" 
                        type="text" 
                        placeholder="nhập tên của bạn" 
                        onChange={(e) => setFullName(e.target.value)}
                        required />
                </div>

                <a className="form__request" href="/signin">Đã có tài khoản?</a>

                <button type="submit" className="form__button">TẠO TÀI KHOẢN</button>
            </form>
        </div>
    );
}

export default Signup;
