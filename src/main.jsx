import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import { router } from "./router/Router";
import Authprovider from "./context/Authprovider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Authprovider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
          toastStyle={{
          width: "420px",
          height: "80px",
          fontSize: "16px",
          padding: "18px",
          borderRadius: "12px",
  }}
      />
    </Authprovider>
  </StrictMode>
);