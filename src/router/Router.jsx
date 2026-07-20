import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../Layout/Mainlayout";
import Home from "../pages/Home";
import NotFound from "../component/shared/Notfound";
import Register from "../pages/Authentication/Register";
import Login from "../pages/Authentication/Login";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import AddApplication from "../pages/Dashboard/AddApplication";
import AllApplication from "../pages/Dashboard/DashboardRoutes/AllApplication";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Mainlayout />,
        errorElement: <NotFound/>,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "register",
                element: <Register/>
            }
        ]
    },
     {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "add-application",
        element : <AddApplication/>
      },
      {
        path: "all-applications",
        element : <AllApplication/>
      }
    ],
  },
    
  
    {
        path: "*",
        element:<NotFound />
    }
]);