import React from "react";
import { css, cx } from "@linaria/atomic";
import { THEME } from "../../providers/ThemeProvider";
import ResponsiveContainer from "../ResponsiveContainer";
import MenuItems from "../MenuItems";
import MenuItem from "../MenuItems/MenuItem";

const classNames = {
  container: css`
    position: sticky;
    top: 0;
  `,
  header: css`
    padding: ${THEME.spacing.medium16px} 0;
    background-color: ${THEME.palette.background};
    display: flex;
    align-items: center;
  `,
  menuItems: css`
    flex-grow: 1;
  `,
};

export default function Header(): JSX.Element {
  return (
    <ResponsiveContainer className={cx(classNames.container)}>
      <header className={cx(classNames.header)}>
        <div>Xapphire13</div>
        <MenuItems className={cx(classNames.menuItems)}>
          <MenuItem>Projects</MenuItem>
          <MenuItem>About</MenuItem>
        </MenuItems>
      </header>
    </ResponsiveContainer>
  );
}
