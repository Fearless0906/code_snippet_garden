import { LogOutIcon, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../auth/store/store";
import { logout } from "../auth/store/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div
          className="flex items-center gap-2 justify-center ml-25 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/20">
            <div className="absolute inset-0 flex items-center justify-center text-primary font-semibold">
              C
            </div>
          </div>
          <span className="font-semibold text-lg">Code Snippet</span>
        </div>
        <div className="hidden md:flex md:flex-1 md:justify-center md:px-6">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search snippets..."
              className="pl-8 w-full bg-background"
            />
          </div>
        </div>
        <nav className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => navigate("/languages")}
          >
            Languages
          </Button>
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => navigate("/topics")}
          >
            Topics
          </Button>
          <Button
            variant="ghost"
            className="text-sm"
            onClick={() => navigate("/about")}
          >
            About
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-3 bg-gray-50 p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
                <Avatar className="h-8 w-8 border-2 border-primary">
                  <AvatarImage
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=random`
                    }
                    alt={`${user?.first_name || "User"} ${
                      user?.last_name || ""
                    }`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.first_name?.charAt(0)}
                    {user?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                  Profile
                </DropdownMenuItem> */}
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="hidden md:flex">
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
