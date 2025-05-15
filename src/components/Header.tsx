import { setSearchTerm } from "../store/slices/layoutSlice";
import { Badge } from "./ui/badge";
import {
  Highlighter,
  LogOutIcon,
  Search,
  Settings,
  User,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
import { useEffect } from "react";
import { getSavedSnippets } from "../data/snippet";
import { setSavedCount } from "../auth/store/slices/savedSnippetsSlice";
import AddSnippetDialog from "./AddSnippetDialog";

interface HeaderProps {
  onSidebarToggle?: () => void;
  onSearch: (value: string) => void;
  searchTerm: string;
}

const Header = ({ onSidebarToggle }: HeaderProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const savedCount = useSelector(
    (state: RootState) => state.savedSnippets.count
  );
  const searchTerm = useSelector((state: RootState) => state.layout.searchTerm);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleMarks = () => {
    navigate("/marks");
  };

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
    <header className="flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-sm">
      <div className="flex items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        ></div>
      </div>

      <div className="flex-1 px-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Search snippets by title, language, or tags..."
            className="w-full pl-9 h-9 bg-background/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4">
        <AddSnippetDialog onSnippetCreated={() => {}} />

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
              >
                {savedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white z-10"
                  >
                    {savedCount}
                  </Badge>
                )}
                <Avatar className="h-8 w-8">
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
            <DropdownMenuContent className="w-56 mr-2" align="end">
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
                    className="ml-auto h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white"
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
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
