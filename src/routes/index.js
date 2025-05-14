import Signup from "../pages/Signup";
import Signin from "../pages/Signin/index.js";
import LayoutDefault from "../layouts/LayoutDefault/index.js";
import Home from "../pages/Home/index.js";
import Message from "../pages/Message/index.js";
import Notifications from "../pages/Notifications/index.js";
import Friends from "../pages/friends/index.js";

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
                    element: <LayoutDefault />,
                    children: [
                        {
                            path: '/',
                            element: <Home />
                        },
                        {
                            path: 'friends',
                            element: <Friends />
                        },
                        {
                            path: 'message',
                            element: <Message />
                        },
                        {
                            path: 'notifications',
                            element: <Notifications />
                        }
                    ]
            } 
        ]
        
    }
]