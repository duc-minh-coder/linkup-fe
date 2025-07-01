import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function Profile() {
    const { userId } = useParams();

    const getUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`http://localhost:8080/api/profiles/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })

            console.log(response.data.result);

        }
        catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="profile">
            profile
        </div>
    )
}

export default Profile;