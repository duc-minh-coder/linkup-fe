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
            <form className='form'>
                <div className='form__text-content'>Đăng kí</div>

                <div className='form__box'>
                    <img src={ userIcon } className='form__img'/>
                    
                    <input className='form__input' type='text' placeholder='Tên người dùng' required />
                </div>

                <div className='form__box'>
                    <img src={ passIcon } className='form__img'/>
                    
                    <input className='form__input' type='password' placeholder='Mật khẩu' required />
                </div>

                <div className='form__box'>
                    <img src={ passIcon } className='form__img'/>
                    
                    <input className='form__input' type='password' placeholder='Xác nhận mật khẩu' required />
                </div>

                <a className='form__request' href='/signin' >đã có tài khoản</a>

                <button type="submit" className='form__button' onClick={handleSubmit}>TẠO TÀI KHOẢN</button>
            </form>
        </div>
    ) 
}

export default Signup;