import './signin.scss';
import userIcon from '../../assets/icon/userIcon.png';
import passIcon from '../../assets/icon/passIcon.png';
import { useNavigate } from 'react-router-dom';

function Signin() {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault(); 

        navigate('/');
    };
    return (
        <div className="sign-in">
            <form className='form'>
                <div className='form__text-content'>Đăng nhập</div>

                <div className='form__box'>
                    <img src={ userIcon } className='form__img'/>
                    
                    <input className='form__input' type='text' placeholder='Tên người dùng' required />
                </div>

                <div className='form__box'>
                    <img src={ passIcon } className='form__img'/>
                    
                    <input className='form__input' type='password' placeholder='Mật khẩu' required />
                </div>

                <a className='form__request' href="/signup" >chưa có tài khoản?</a>

                <button type="submit" className='form__button' onClick={handleSubmit}>ĐĂNG NHẬP</button>
            </form>
        </div>
    ) 
}

export default Signin;