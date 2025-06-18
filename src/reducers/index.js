import { combineReducers } from "redux";
import userReducer from "./userReducer";
import createUserReducer from "./createUserReducer";

const allReducers = combineReducers({
    user: userReducer,
    createUser: createUserReducer,
    
})

export default allReducers;