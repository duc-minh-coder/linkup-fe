const initState = {
    token: "",
    isLogin: false
}

const userReducer = (state = initState, action) => {
    switch(action.type) {
        case "LOGIN":
            return {
                ...state,
                token: action.token,
                isLogin: true
            }
        case "LOGOUT":
            return {
                ...state,
                token: "",
                isLogin: false
            }
        default:
            return state;
    }
}

export default userReducer;