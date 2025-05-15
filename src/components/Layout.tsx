import { useState, useEffect } from "react";
import { getLanguages } from "../data/snippet";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { SidebarNavigation } from "./SidebarNavigation";
import { useTheme } from "./ui/theme-provider";
import { cn } from "../lib/utils";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [languages, setLanguages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchLanguages = async () => {
      const langs = await getLanguages();
      setLanguages(langs);
    };
    fetchLanguages();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen">
      <div
        className={cn(
          "fixed top-0 z-40 w-full transition-all duration-300",
          sidebarOpen ? "pl-64" : "pl-16"
        )}
      >
        <Header
          onSidebarToggle={toggleSidebar}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
      </div>
      fix
      <div className="flex pt-14">
        <SidebarNavigation
          languages={languages}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          isDark={theme === "dark"}
          toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            sidebarOpen ? "ml-64" : "ml-16"
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
