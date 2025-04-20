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
import { Provider } from "react-redux";
import store from "./redux/store.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="min-h-screen">
      <AuthProvider>
        <HelmetProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                <RouterProvider router={router} />
                {/* Any components like global modals or auth listeners can go here */}
                <Toaster position="top-center" reverseOrder={false} />
              </ThemeProvider>
            </QueryClientProvider>
          </Provider>
        </HelmetProvider>
      </AuthProvider>
    </div>
  </StrictMode>
);
