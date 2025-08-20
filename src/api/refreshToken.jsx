import axios from "axios";
import GetApiBaseUrl from "../helpers/GetApiBaseUrl";

async function refreshToken(token) {
    const API_BASE_URL = GetApiBaseUrl();

    try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { token });
        return res.data.result;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export default refreshToken;