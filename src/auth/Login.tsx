import { Github, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useState } from "react";
import { login } from "./store/slices/authSlice";
import SpinnerLoader from "../components/Loader/SpinnerLoader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button className="w-full" type="submit">
            {loading ? <SpinnerLoader /> : "Sign in"}
          </Button>
          <div className="flex items-center w-full justify-end">
            <Button
              variant="link"
              className="text-xs text-muted-foreground p-0 h-auto hover:text-primary"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Github
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="text-primary p-0 h-auto font-normal hover:underline"
            onClick={handleSignUp}
          >
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Login;
