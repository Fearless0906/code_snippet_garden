import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { setUser } from "./auth/store/slices/authSlice";

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
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
