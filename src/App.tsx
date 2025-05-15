import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { setUser } from "./auth/store/slices/authSlice";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "sonner";
import SpinnerLoader from "./components/Loader/SpinnerLoader";

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load auth state from localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(setUser(parsedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center" />
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Suspense fallback={<SpinnerLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
