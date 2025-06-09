const FetchApi = async (url) => {
    const result = await fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data) return data;
            })
            .catch(err => {
                console.log("ERROR:" + err);
            })

    return result;
}

export default FetchApi;