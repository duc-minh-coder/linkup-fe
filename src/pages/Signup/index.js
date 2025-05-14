import './signup.scss';
import userIcon from '../../assets/icon/userIcon.png';
import passIcon from '../../assets/icon/passIcon.png';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); 
        navigate('/signin');
    };

    return (
        <div className="sign-up">
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="form__title">Đăng ký</h2>

                <div className="form__box">
                    <img src={userIcon} className="form__img" alt="User Icon"/>
                    <input className="form__input" type="text" placeholder="Tên người dùng" required />
                </div>

                <div className="form__box">
                    <img src={passIcon} className="form__img" alt="Password Icon"/>
                    <input className="form__input" type="password" placeholder="Mật khẩu" required />
                </div>

                <div className="form__box">
                    <img src={passIcon} className="form__img" alt="Confirm Password Icon"/>
                    <input className="form__input" type="password" placeholder="Xác nhận mật khẩu" required />
                </div>

                <a className="form__request" href="/signin">Đã có tài khoản?</a>

                <button type="submit" className="form__button">TẠO TÀI KHOẢN</button>
            </form>
        </div>
    );
}

export default Signup;
