import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./LayoutDefault.scss";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../actions/userAction";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import GetApiBaseUrl from "../../helpers/GetApiBaseUrl";

function LayoutDefault() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const token = useSelector((state) => state.user.token);

    const API_BASE_URL = GetApiBaseUrl();

    const [isChecking, setIsChecking] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    const getInfo = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/api/profiles/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            setUserInfo(response.data.result);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!token) {
        const saveToken = localStorage.getItem("token");

        if (saveToken) dispatch(login(saveToken));
        }

        const checkAuth = async () => {
            const accessToken = token || localStorage.getItem("token");

            if (!accessToken) {
                navigate("/signin");
                return;
            }

            try {
                const res = await axios.post(`${API_BASE_URL}/api/auth/introspect`, {
                    token: accessToken,
                });

                if (!res.data.result.valid) {
                    const refreshToken = await axios.post( `${API_BASE_URL}/api/auth/refresh`, {
                        token: accessToken,
                    });

                    const newToken = refreshToken.data.result.token;

                    localStorage.setItem("token", newToken);
                }
            } catch (err) {
                dispatch(logout(accessToken));
                navigate("/signin");
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
        getInfo();
    }, []);

    if (isChecking) {
        return <div className="check-login">Đang kiểm tra đăng nhập...</div>;
    }
    return (
        <>
        <div className="layout-default">
            <Sidebar userInfo={userInfo} />

            <main className="main">
                <Outlet key={location.pathname} />
            </main>
        </div>
        </>
    );
}

export default LayoutDefault;
