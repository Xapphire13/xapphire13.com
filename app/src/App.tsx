import React from "react";
import { css } from "@linaria/atomic";
import { cx } from "@linaria/core";

const classNames = {
  container: css`
    color: red;
  `,
};

export default function App(): JSX.Element {
  return <p className={cx(classNames.container)}>Hello React!</p>;
}
