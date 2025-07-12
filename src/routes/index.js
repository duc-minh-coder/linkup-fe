import Signup from "../pages/Signup";
import Signin from "../pages/Signin/index.jsx";
import LayoutDefault from "../layouts/LayoutDefault/index.jsx";
import Message from "../pages/Message/index.jsx";
import Notifications from "../pages/Notifications/index.jsx";
import Profile from "../pages/Profile/index.jsx";
import HomePage from "../pages/HomePage/index.jsx";
import Error from "../pages/Error/index.jsx";   
import Friends from "../pages/Friends/index.jsx";
import FriendPage from "../pages/Friends/FriendPage/index.jsx";
import FriendRequestsPage from "../pages/Friends/FriendRequestPage/index.jsx";
import BookmarkPage from "../pages/BookmarkPage/index.jsx";
import About from "../pages/About/index.jsx";

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
                        element: <Friends />, 
                        children: [
                            {
                                path: '',
                                element: <FriendPage />
                            },
                            {
                                path: 'request',
                                element: <FriendRequestsPage />
                            }
                        ]
                    },
                    {
                        path: '/messages',
                        children: [
                            {
                                path: '',
                                element: <Message />
                            },
                            {
                                path: ':receiverId',
                                element: <Message />
                            }
                        ]
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
                        path: '/bookmark',
                        element: <BookmarkPage />
                    },
                    {
                        path: '/about',
                        element: <About />
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