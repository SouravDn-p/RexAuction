import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes.jsx";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./providers/AuthProvider.jsx";
import { ThemeProvider } from "./component/Context/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="min-h-screen">
      <HelmetProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <RouterProvider router={router} />
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
      </HelmetProvider>
    </div>
  </StrictMode>
);
