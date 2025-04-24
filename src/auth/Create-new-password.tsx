import React from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { toast } from "sonner";
import { resetPasswordConfirm } from "./store/slices/authSlice";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
import { Eye, EyeOff } from "lucide-react";

const CreateNewPassword = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { resetPasswordLoading, resetPasswordError } = useSelector(
    (state: RootState) => state.auth
  );

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !token) {
      toast.error("Invalid reset password link");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await dispatch(
        resetPasswordConfirm({
          uid,
          token,
          new_password: password,
          re_new_password: confirmPassword,
        })
      ).unwrap();
      toast.success("Password reset successfully! Please log in.");
      navigate("/");
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create New Password</h1>
          <p className="text-muted-foreground">
            Please enter your new password below
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {resetPasswordError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {resetPasswordError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="new_password">
              New Password
            </label>
            <div className="relative">
              <Input
                id="new_password"
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

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirm_password">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={resetPasswordLoading}
          >
            {resetPasswordLoading ? <SpinnerLoader /> : "Reset Password"}
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

export default CreateNewPassword;
