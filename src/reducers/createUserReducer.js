const initState = {
    username: "",
    password: "",
    fullname: ""
}

const createUserReducer = (state = initState, action) => {
    switch(action.type) {
        case "CREATE":
            return {
                ...state,
                username: action.username,
                password: action.password,
                fullname: action.fullname
            }
        default:
            return state;
    }
}

export default createUserReducer;