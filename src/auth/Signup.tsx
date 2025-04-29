import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { signup } from "./store/slices/authSlice";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const validations = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    passwordsMatch: formData.password === formData.re_password,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!Object.values(validations).every(Boolean)) {
      return;
    }

    try {
      const signupData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        re_password: formData.re_password,
      };

      await dispatch(signup(signupData)).unwrap();
      toast.success("Account created successfully! Please log in.");
      navigate("/");
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your details to get started
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="first_name">
              First Name
            </label>
            <Input
              id="first_name"
              type="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="last_name">
              Last Name
            </label>
            <Input
              id="last_name"
              type="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
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
            {formData.password && (
              <div className="space-y-2 text-sm mt-2">
                <div
                  className={`flex items-center gap-2 ${
                    validations.minLength ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      validations.minLength ? "bg-green-600" : "bg-red-600"
                    }`}
                  />
                  At least 8 characters
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    validations.hasUpperCase ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      validations.hasUpperCase ? "bg-green-600" : "bg-red-600"
                    }`}
                  />
                  One uppercase character
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    validations.hasSpecialChar
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      validations.hasSpecialChar ? "bg-green-600" : "bg-red-600"
                    }`}
                  />
                  One special character
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="re_password">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="re_password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.re_password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formData.re_password && (
              <div
                className={`flex items-center gap-2 text-sm mt-2 ${
                  validations.passwordsMatch ? "text-green-600" : "text-red-600"
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    validations.passwordsMatch ? "bg-green-600" : "bg-red-600"
                  }`}
                />
                Passwords match
              </div>
            )}
          </div>
          <Button
            className="w-full flex items-center justify-center gap-2"
            type="submit"
            // disabled={!Object.values(validations).every(Boolean) || loading}
          >
            {loading ? <SpinnerLoader /> : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="text-primary p-0 h-auto font-normal hover:underline"
            onClick={handleSignIn}
          >
            Login
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
