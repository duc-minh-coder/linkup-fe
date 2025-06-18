export const login = (token) => {
    return {
        type: "LOGIN",
        token: token
    }
}

export const logout = (token) => {
    return {
        type: "LOGOUT",
        token: token
    }
}