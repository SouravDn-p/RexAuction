import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import { Home } from "lucide-react";
import MainLayout from "../layout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
    ],
  },
]);
