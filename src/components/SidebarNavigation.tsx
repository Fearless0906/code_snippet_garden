import { Code, Home, Menu, Moon, Sun, Globe, Tags } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { getLanguageIcon } from "../data/languageIcons";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 text-sm font-medium",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
};

interface SidebarNavigationProps {
  languages: string[];
  isOpen: boolean;
  onToggle: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const navItems = [
  { label: "Languages", href: "/languages", icon: Globe },
  { label: "Topics", href: "/topics", icon: Tags },
  { label: "About", href: "/about", icon: Code },
];

const LanguageIcon = ({ language }: { language: string }) => {
  const Icon = getLanguageIcon(language);
  return (
    <div className="flex h-4 w-4 items-center justify-center">
      {Icon && <Icon className="h-4 w-4" />}
    </div>
  );
};

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  languages,
  isOpen,
  onToggle,
  isDark,
  toggleTheme,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r bg-card transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        isMobile && !isOpen && "hidden"
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-4">
        {isOpen && <h2 className="font-semibold">Code Snippet</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* Dashboard Section */}
        <div className="mb-4">
          {isOpen && (
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dashboard
            </p>
          )}
          <SidebarItem
            icon={Home}
            label={isOpen ? "Home" : ""}
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
          />

          {/* Add Navigation Items */}
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={isOpen ? item.label : ""}
              active={location.pathname === item.href}
              onClick={() => navigate(item.href)}
            />
          ))}
        </div>

        {/* Languages Section */}
        <div className="mb-4">
          {isOpen && (
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Languages
            </p>
          )}
          {languages.map((language) => (
            <SidebarItem
              key={language}
              icon={() => <LanguageIcon language={language} />}
              label={isOpen ? language : ""}
              active={location.search.includes(`language=${language}`)}
              onClick={() => navigate(`/dashboard?language=${language}`)}
            />
          ))}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isOpen && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </Button>
      </div>
    </div>
  );
};
