import { css, cx } from "@linaria/atomic";
import React from "react";
import { THEME } from "../providers/ThemeProvider";
import MenuItems from "./MenuItems";
import MenuItem from "./MenuItems/MenuItem";
import ResponsiveContainer from "./ResponsiveContainer";
import { GithubLogo } from "phosphor-react";

const classNames = {
  container: css`
    background-color: ${THEME.palette.accent};
  `,
  innerContainer: css`
    display: flex;
    padding: ${THEME.spacing.medium16px} 0;
    align-items: center;
  `,
  menuItems: css`
    flex: 1;
  `,
};

export default function Footer(): JSX.Element {
  const onBackToTopPressed = () => {
    document
      .getElementById("app-container")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={cx(classNames.container)}>
      <ResponsiveContainer>
        <div className={cx(classNames.innerContainer)}>
          <button type="button" onClick={onBackToTopPressed}>
            Back to top
          </button>

          <MenuItems className={cx(classNames.menuItems)}>
            <MenuItem label="GitHub">
              <GithubLogo size={32} />
            </MenuItem>
          </MenuItems>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}
