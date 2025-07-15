import { ToastContainer } from "react-toastify";
import AllRoutes from "./components/AllRoutes/index.js";

function App() {
    return (
        <>
            <AllRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}

export default App;
