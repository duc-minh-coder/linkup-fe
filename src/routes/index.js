import Signup from "../pages/Signup";
import Signin from "../pages/Signin/index.js";
import LayoutDefault from "../layouts/LayoutDefault/index.js";
import Message from "../pages/Message/index.js";
import Notifications from "../pages/Notifications/index.js";
import Profile from "../pages/Profile/index.js";
import HomePage from "../pages/HomePage/index.js";
import Error from "../pages/Error/index.js";
import Friends from "../pages/Friends/index.js";

export const routes = [
    {
        path: '/',
        children: [
            {
                path: '/signin',
                element: <Signin /> 
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: "",
                element: <LayoutDefault />,
                children: [
                    {
                        path: '/',
                        element: <HomePage />
                    },
                    {
                        path: '/friends',
                        element: <Friends />
                    },
                    {
                        path: '/messages',
                        element: <Message />
                    },
                    {
                        path: '/notifications',
                        element: <Notifications />
                    },
                    {
                        path: '/profile/:userId',
                        element: <Profile />
                    },
                    {
                        path: '*',
                        element: <Error />
                    }
                ]
            } 
        ]
    }
]