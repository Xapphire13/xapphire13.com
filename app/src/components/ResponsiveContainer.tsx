import { css, cx } from "@linaria/atomic";
import React from "react";
import { BREAKPOINTS, THEME } from "../providers/ThemeProvider";

const classNames = {
  container: css`
    display: flex;
    justify-content: center;
  `,
  content: css`
    flex-grow: 1;

    ${THEME.responsive.mediumAndAbove} {
      max-width: ${BREAKPOINTS.large}px;
    }
  `,
};

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function ResponsiveContainer({
  children,
  className,
}: ResponsiveContainerProps): JSX.Element {
  return (
    <div className={cx(classNames.container, className)}>
      <div className={cx(classNames.content)}>{children}</div>
    </div>
  );
}
