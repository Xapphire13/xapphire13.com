import "./styles/markdown.less";
import "codemirror/mode/gfm/gfm";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/theme/material.css";
import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import {Link} from "react-router-dom";
import {UnControlled as CodeMirror} from "react-codemirror2";

type Props = {
  className: string;
  source: string;
};

type CodeProps = {
  language: string;
  value: string;
};

type LinkProps = {
  children: React.ReactNode;
  href: string;
};

export default (props: Props) => <ReactMarkdown
  {...props}
  renderers={{
    code: ({language = "", value}: CodeProps) => <CodeMirror
      value={value}
      options={{
        readOnly: true,
        lineNumbers: true,
        mode: language && (LANGUAGE_MAP[language.toLowerCase()] || language.toLowerCase()),
        theme: "material"
      }}/>,
    link: ({children, href}: LinkProps) => href.startsWith("/") ?
      <Link to={href} children={children} /> :
      <a href={href} target="_blank">{children}</a>
  }}/>;

const LANGUAGE_MAP: {[key: string]: string} = {
  js: "javascript",
  jsx: "text/jsx",
  markdown: "gfm",
  md: "gfm",
  ts: "text/typescript",
  tsx: "text/typescript-jsx",
  typescript: "text/typescript"
};
