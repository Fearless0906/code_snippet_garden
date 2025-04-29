import { Badge } from "./ui/badge";
import { Highlighter, LogOutIcon, Search, Settings, User } from "lucide-react";
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
import { ModeToggle } from "./ui/mode-toggle";
import { useEffect } from "react";
import { getSavedSnippets } from "../data/snippet";
import { setSavedCount } from "../auth/store/slices/savedSnippetsSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const savedCount = useSelector(
    (state: RootState) => state.savedSnippets.count
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleMarks = () => {
    navigate("/marks");
  };

  const navItems = [
    { label: "Languages", href: "/languages" },
    { label: "Topics", href: "/topics" },
    { label: "About", href: "/about" },
    { label: "Code with AI", href: "/snippet-generator" },
  ];

  useEffect(() => {
    const fetchSavedCount = async () => {
      if (isAuthenticated) {
        const savedSnippets = await getSavedSnippets();
        dispatch(setSavedCount(savedSnippets.length));
      }
    };
    fetchSavedCount();
  }, [isAuthenticated, dispatch]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2.5 cursor-pointer transition-all duration-200 hover:opacity-80"
          onClick={() => navigate("/dashboard")}
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
            <div className="absolute inset-0 flex items-center justify-center text-primary font-semibold">
              C
            </div>
          </div>
          <span className="font-semibold text-lg tracking-tight">
            Code Snippet
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Section */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 transition-colors group-hover:text-primary" />
            <Input
              type="search"
              placeholder="Search snippets..."
              className="pl-9 w-[300px] h-9 bg-background/60 border-muted/40 transition-colors hover:border-primary/50 focus:border-primary"
            />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="text-sm font-medium transition-all hover:text-primary hover:bg-primary/10"
                onClick={() => navigate(item.href)}
              >
                {item.label}
              </Button>
            ))}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    {savedCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs z-10 bg-red-500 dark:text-white text-white"
                      >
                        {savedCount}
                      </Badge>
                    )}
                    <Avatar className="h-8 w-8 ring-2 ring-background">
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
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mr-2 backdrop-blur-xl bg-background/95 border border-border/50"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-medium leading-none">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground/60">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                    <User className="mr-2.5 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                    <Settings className="mr-2.5 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer relative"
                    onClick={handleMarks}
                  >
                    <Highlighter className="mr-2.5 h-4 w-4" />
                    <span>Marks</span>
                    {savedCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 dark:text-white text-white"
                      >
                        {savedCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={handleLogout} className="m-auto">
                    <Button className="w-full">
                      {" "}
                      <LogOutIcon className="mr-2.5 h-4 w-4" /> Log out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="hidden md:flex bg-primary/90 hover:bg-primary transition-colors"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}

            <div className="pl-1">
              <ModeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
