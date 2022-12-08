import React from "react";
import { css, cx } from "@linaria/atomic";
import ResponsiveContainer from "./ResponsiveContainer";

const classNames = {
  container: css`
    min-height: 100%;
  `,
};

export interface PageContentProps {
  children: React.ReactNode;
}

export default function PageContent({
  children,
}: PageContentProps): JSX.Element {
  return (
    <ResponsiveContainer className={cx(classNames.container)}>
      <main>{children}</main>
    </ResponsiveContainer>
  );
}
