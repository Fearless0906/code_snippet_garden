import { languageIcons } from "../data/languageIcons";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../components/ui/sidebar";
import { Code, Layers } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

interface SidebarNavigationProps {
  languages: string[];
  topics: string[];
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  languages,
  topics,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params for filtering
  const queryParams = new URLSearchParams(location.search);
  const activeLanguage = queryParams.get("language") || null;
  const activeTopic = queryParams.get("topic") || null;

  // Navigation handlers
  const handleLanguageClick = (lang: string) => {
    queryParams.set("language", lang);
    queryParams.delete("topic");
    navigate({ pathname: "/dashboard", search: queryParams.toString() });
  };

  const handleTopicClick = (topic: string) => {
    queryParams.set("topic", topic);
    queryParams.delete("language");
    navigate({ pathname: "/dashboard", search: queryParams.toString() });
  };

  return (
    <Sidebar
      data-sidebar="sidebar"
      className="h-full lg:pt-12 w-72 border-r bg-background/60 backdrop-blur-sm"
    >
      <SidebarContent className="flex flex-col px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 font-medium px-2">
            Languages
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {languages.map((language) => (
                <SidebarMenuItem key={language}>
                  <SidebarMenuButton
                    onClick={() => handleLanguageClick(language)}
                    data-active={activeLanguage === language}
                    asChild
                  >
                    <Button
                      className="flex items-center gap-3 w-full justify-start rounded-lg hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground transition-all duration-200"
                      variant="ghost"
                    >
                      {languageIcons[language] || <Code className="size-4" />}
                      <span className="font-medium">{language}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    queryParams.delete("language");
                    navigate({
                      pathname: "/dashboard",
                      search: queryParams.toString(),
                    });
                  }}
                  data-active={!activeLanguage && !activeTopic}
                  asChild
                >
                  <Button
                    className="flex items-center gap-3 w-full justify-start rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    variant="ghost"
                  >
                    <Code className="size-4" />
                    <span className="font-medium">All Languages</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 font-medium px-2">
            Topics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topics.map((topic) => (
                <SidebarMenuItem key={topic}>
                  <SidebarMenuButton
                    onClick={() => handleTopicClick(topic)}
                    data-active={activeTopic === topic}
                    asChild
                  >
                    <Button
                      className="flex items-center gap-3 w-full justify-start rounded-lg hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground transition-all duration-200"
                      variant="ghost"
                    >
                      <Layers className="size-4" />
                      <span className="font-medium">{topic}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    queryParams.delete("topic");
                    navigate({ pathname: "/", search: queryParams.toString() });
                  }}
                  data-active={!activeTopic && !activeLanguage}
                  asChild
                >
                  <Button
                    className="flex items-center gap-3 w-full justify-start rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                    variant="ghost"
                  >
                    <Layers className="size-4" />
                    <span className="font-medium">All Topics</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
