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
} from "react-icons/si";
import React from "react";

const wrapIcon = (Icon: React.ElementType) => {
  return (props: React.SVGProps<SVGSVGElement>) => (
    <Icon className={`h-4 w-4 ${props.className || ""}`} {...props} />
  );
};

export const getLanguageIcon = (language: string): React.ElementType => {
  const icons: Record<string, React.ElementType> = {
    JavaScript: wrapIcon(DiJavascript1),
    TypeScript: wrapIcon(SiTypescript),
    Python: wrapIcon(DiPython),
    Java: wrapIcon(DiJava),
    HTML: wrapIcon(DiHtml5),
    CSS: wrapIcon(DiCss3),
    PHP: wrapIcon(DiPhp),
    Ruby: wrapIcon(DiRuby),
    "C++": wrapIcon(SiCplusplus),
    "C#": wrapIcon(DiFsharp),
    Go: wrapIcon(DiGo),
    Rust: wrapIcon(SiRust),
    Swift: wrapIcon(SiSwift),
    Kotlin: wrapIcon(SiKotlin),
    Dart: wrapIcon(SiDart),
    React: wrapIcon(DiReact),
    Angular: wrapIcon(DiAngularSimple),
    MongoDB: wrapIcon(DiMongodb),
    MySQL: wrapIcon(DiMysql),
  };

  return icons[language] || wrapIcon(Code);
};
