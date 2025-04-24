import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { resetPassword } from "./store/slices/authSlice";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { resetPasswordLoading, resetPasswordError } = useSelector(
    (state: RootState) => state.auth
  );

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(resetPassword(email)).unwrap();
      toast.success("Password reset email sent! Please check your inbox.");
      navigate("/");
    } catch (error) {
      console.error("Reset password failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {resetPasswordError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {resetPasswordError}
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
          <Button
            className="w-full"
            type="submit"
            disabled={resetPasswordLoading}
          >
            {resetPasswordLoading ? <SpinnerLoader /> : "Send Email"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Button
            variant="link"
            className="text-primary p-0 h-auto font-normal hover:underline"
            onClick={handleBackToLogin}
          >
            Back to Login
          </Button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
