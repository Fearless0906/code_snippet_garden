// import React, { useState, useMemo } from "react";
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
    <Sidebar data-sidebar="sidebar" className="h-full pt-14 lg:pt-20 w-64">
      <SidebarContent className="flex flex-col">
        <SidebarGroup>
          <SidebarGroupLabel>Languages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {languages.map((language) => (
                <SidebarMenuItem key={language}>
                  <SidebarMenuButton
                    onClick={() => handleLanguageClick(language)}
                    data-active={activeLanguage === language}
                    asChild
                  >
                    <button className="flex items-center gap-2 w-full">
                      <Code className="size-4" />
                      <span>{language}</span>
                    </button>
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
                  <button className="flex items-center gap-2 w-full font-semibold">
                    All Languages
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>Topics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {topics.map((topic) => (
                <SidebarMenuItem key={topic}>
                  <SidebarMenuButton
                    onClick={() => handleTopicClick(topic)}
                    data-active={activeTopic === topic}
                    asChild
                  >
                    <button className="flex items-center gap-2 w-full">
                      <Layers className="size-4" />
                      <span>{topic}</span>
                    </button>
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
                  <button className="flex items-center gap-2 w-full font-semibold">
                    All Topics
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
