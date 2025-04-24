import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Index from "../pages/Index";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import Activate from "../auth/Activate";
import CreateNewPassword from "../auth/Create-new-password";
import SnippetDetailPage from "../pages/SnippetDetail";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../auth/Forgot-password";
import Layout from "../components/Layout";
import { RootState } from "../auth/store/store";
import AboutPage from "../pages/About";
import TopicsPage from "../pages/Topics";
import LanguagesPage from "../pages/Languages";
import PracticeExercises from "../pages/PracticeExercises";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/activate/:uid/:token",
    element: <Activate />,
  },
  {
    path: "/password/reset/confirm/:uid/:token",
    element: <CreateNewPassword />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Index />,
      },
      {
        path: "/languages",
        element: <LanguagesPage />,
      },
      {
        path: "/topics",
        element: <TopicsPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/practice/:id",
        element: <PracticeExercises />,
      },
      {
        path: "/dashboard/code-snippet/:id",
        element: <SnippetDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
