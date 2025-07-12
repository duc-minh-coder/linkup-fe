import './signup.scss';
import userIcon from '../../assets/icon/userIcon.png';
import passIcon from '../../assets/icon/passIcon.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (password == confirmPassword) {
            
            const response = await axios.post(`${API_BASE_URL}/api/user`, {
                username: username,
                password: password,
                fullName: fullName
            });

            if (response)
                console.log("done");
                
            // navigate('/signin');
        }
        else alert("mật khẩu nhập lại không đúng");
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
