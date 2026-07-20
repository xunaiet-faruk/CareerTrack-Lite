import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../Layout/Mainlayout";
import Home from "../pages/Home";
import NotFound from "../component/shared/Notfound";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Mainlayout />,
        errorElement: "<NotFound />",
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "login",
                element: "<Login />"
            },
        ]
    },
  
    {
        path: "*",
        element:<NotFound />
    }
]);