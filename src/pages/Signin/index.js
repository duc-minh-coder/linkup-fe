import './signin.scss';
import userIcon from '../../assets/icon/userIcon.png';
import passIcon from '../../assets/icon/passIcon.png';
import { useNavigate } from 'react-router-dom';
import googleIcon from "../../assets/icon/google.png";
import fbIcon from "../../assets/icon/facebook.png";

function Signin() {
    const navigate = useNavigate();
    
    const handleSubmit = (event) => {
        event.preventDefault(); 
        navigate('/');
    };

    return (
        <div className="sign-in">
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="form__title">Đăng nhập</h2>

                <div className="form__box">
                    <img src={userIcon} className="form__img" alt="User Icon"/>
                    <input className="form__input" type="text" placeholder="Tên người dùng / SĐT" required />
                </div>

                <div className="form__box">
                    <img src={passIcon} className="form__img" alt="Password Icon"/>
                    <input className="form__input" type="password" placeholder="Nhập mật khẩu" required />
                </div>

                <a className="form__request" href="/signup">Chưa có tài khoản?</a>

                <button type="submit" className="form__button">ĐĂNG NHẬP</button>

                <div className="form__social">
                    <button className="form__google">
                        <img src={googleIcon} alt="Google Icon"/>
                        Đăng nhập bằng Google
                    </button>

                    <button className="form__fb">
                        <img src={fbIcon} alt="Facebook Icon"/>
                        Đăng nhập bằng Facebook
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Signin;
