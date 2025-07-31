const GetApiBaseUrl = () => {
    const localDefault = process.env.REACT_APP_API_URL || "http://localhost:8080";

    if (window.location.hostname !== 'localhost') {
        return localDefault.replace("localhost", "192.168.1.12")
    }

    return localDefault;
}

export default GetApiBaseUrl;