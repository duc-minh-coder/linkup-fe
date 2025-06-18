export const signup = (username, password, fullname) => {
    return {
        type: "CREATE",
        username: username,
        password: password,
        fullname: fullname
    }
}