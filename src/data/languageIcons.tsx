import { Code } from "lucide-react";
import {
  DiJavascript1,
  DiPython,
  DiJava,
  DiHtml5,
  DiCss3,
  DiPhp,
  DiRuby,
  DiReact,
  DiAngularSimple,
  DiMongodb,
  DiGo,
  DiMysql,
  DiFsharp,
} from "react-icons/di";
import {
  SiTypescript,
  SiCplusplus,
  SiRust,
  SiSwift,
  SiKotlin,
  SiDart,
  SiDjango,
  SiOpenai,
} from "react-icons/si";
import React from "react";

const wrapIcon = (Icon: React.ElementType) => {
  return (props: React.SVGProps<SVGSVGElement>) => (
    <Icon className={`h-4 w-4 ${props.className || ""}`} {...props} />
  );
};

export const getLanguageIcon = (language: string): React.ElementType => {
  // Normalize the language name to handle case-insensitive matching
  const normalizedLanguage = language.toLowerCase();

  const icons: Record<string, React.ElementType> = {
    javascript: wrapIcon(DiJavascript1),
    typescript: wrapIcon(SiTypescript),
    python: wrapIcon(DiPython),
    java: wrapIcon(DiJava),
    html: wrapIcon(DiHtml5),
    css: wrapIcon(DiCss3),
    php: wrapIcon(DiPhp),
    ruby: wrapIcon(DiRuby),
    "c++": wrapIcon(SiCplusplus),
    "c#": wrapIcon(DiFsharp),
    go: wrapIcon(DiGo),
    rust: wrapIcon(SiRust),
    swift: wrapIcon(SiSwift),
    kotlin: wrapIcon(SiKotlin),
    dart: wrapIcon(SiDart),
    react: wrapIcon(DiReact),
    angular: wrapIcon(DiAngularSimple),
    mongodb: wrapIcon(DiMongodb),
    mysql: wrapIcon(DiMysql),
    django: wrapIcon(SiDjango),
    chatgpt: wrapIcon(SiOpenai),
    openai: wrapIcon(SiOpenai),
  };

  return icons[normalizedLanguage] || wrapIcon(Code);
};
