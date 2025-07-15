import { useEffect, useRef, useState } from "react";
import "./ConfigContainer.scss";

function ConfigContainer({ isOwner, handlingCloseConfig, handleLogout, handleDeleteAccount }) {
    const dropdownRef = useRef(null);
    const [boxRequest, setBoxRequest] = useState(false);
    
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
                            onClick={() => setBoxRequest(true)}
                        >Xoá tài khoản
                        </button>

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