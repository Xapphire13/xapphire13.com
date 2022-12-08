import { css, cx } from "@linaria/atomic";
import React from "react";
import { THEME } from "../../providers/ThemeProvider";

const classNames = {
  container: css`
    display: flex;
    justify-content: right;
    gap: ${THEME.spacing.small8px};
    list-style: none;
    margin: 0;
  `,
};

export interface MenuItemsProps {
  children: React.ReactNode;
  className?: string;
}

export default function MenuItems({
  className,
  children,
}: MenuItemsProps): JSX.Element {
  return <ul className={cx(classNames.container, className)}>{children}</ul>;
}
