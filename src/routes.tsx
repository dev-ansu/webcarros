import {createBrowserRouter} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CarDetail from "./pages/Car"
import New from "./pages/Dashboard/New"
import Register from "./pages/Register"
import Layout from "./components/Layout"
import Private from "./routes/Private";


export const router = createBrowserRouter([
    {
        element: <Layout />,
        children:[
            {
                path:"/",
                element:<Home />
            },
            {
                path:"/car/:id",
                element:<CarDetail />
            },
            {
                path:"/dashboard",
                element:
                <Private>
                    <Dashboard />
                </Private>,
            },
            {           
                path:"/dashboard/new",
                element: 
                <Private>
                    <New />
                </Private>
            }
                        
        ]
    },
    {
        path:"/login",
        element: <Login />
    },
    {
        path:"/register",
        element: <Register />
    }
]);
