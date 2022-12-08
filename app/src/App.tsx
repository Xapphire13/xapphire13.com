import React from "react";
import "modern-normalize";
import HomePage from "./components/pages/HomePage";
import ThemeProvider, { THEME } from "./providers/ThemeProvider";
import { css, cx } from "@linaria/atomic";

const classNames = {
  container: css`
    height: 100%;
    width: 100%;
    color: ${THEME.palette.text};
    background-color: ${THEME.palette.background};
    position: relative;
    overflow: auto;
  `,
};

export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      {({ className }) => (
        <div id="app-container" className={cx(className, classNames.container)}>
          <HomePage />
        </div>
      )}
    </ThemeProvider>
  );
}
