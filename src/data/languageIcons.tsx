import { ReactElement } from "react";
import { FaReact } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiEjs,
  SiPhp,
  SiPython,
  SiJson,
  SiMarkdown,
} from "react-icons/si";

export const languageIcons: Record<string, ReactElement> = {
  React: <FaReact className="size-4" />,
  JavaScript: <SiJavascript className="size-4" />,
  TypeScript: <SiTypescript className="size-4" />,
  HTML: <SiHtml5 className="size-4" />,
  CSS: <SiCss3 className="size-4" />,
  Vue: <SiEjs className="size-4" />,
  PHP: <SiPhp className="size-4" />,
  Python: <SiPython className="size-4" />,
  JSON: <SiJson className="size-4" />,
  Markdown: <SiMarkdown className="size-4" />,
};
