import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes.jsx";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./providers/AuthProvider.jsx";
import { ThemeProvider } from "./component/Context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="min-h-screen">
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider> {/* Wrap everything inside ThemeProvider */}
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </div>
  </StrictMode>
);
