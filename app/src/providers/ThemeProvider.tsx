import React, { useEffect, useState } from "react";
import { css, cx } from "@linaria/atomic";
import { DateTime } from "luxon";
import { MINUTE_IN_MS } from "../constants/Time";

const classNames = {
  base: css`
    --spacing-small-8px: 8px;
    --spacing-medium-16px: 16px;
    --spacing-large-24x: 24px;
  `,
  light: css`
    --color-text: black;
    --color-background: white;
    --color-faint: gray;
    --color-accent: #be46ff;
  `,
  dark: css`
    --color-text: white;
    --color-background: #353a47;
    --color-faint: gray;
    --color-accent: #c65cff;
  `,
};

export const BREAKPOINTS = {
  large: 1280,
  medium: 768,
  small: 320,
} as const;

export const THEME = {
  palette: {
    text: "var(--color-text)",
    background: "var(--color-background)",
    faint: "var(--color-faint)",
    accent: "var(--color-accent)",
  },
  spacing: {
    small8px: "var(--spacing-small-8px)",
    medium16px: "var(--spacing-medium-16px)",
    large24px: "var(--spacing-large-24px)",
  },
  responsive: {
    /** 1280px or larger  */
    extraLargeAndAbove: `@media screen and (min-width: ${BREAKPOINTS.large}px)`,
    /** 768px or larger  */
    largeAndAbove: `@media screen and (min-width: ${BREAKPOINTS.medium}px)`,
    /** 320px or larger  */
    mediumAndAbove: `@media screen and (min-width: ${BREAKPOINTS.small}px)`,
  },
} as const;

interface ThemeContextValue {
  className: string;
  theme: Theme;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  className: "",
  theme: "light",
});

export interface ThemeProviderProps {
  children: (contextValue: ThemeContextValue) => React.ReactNode;
}

type Theme = "light" | "dark";

/** Returns `dark` theme during the night, `light` theme during the day */
function getThemeBasedOnTimeOfDay(): Theme {
  if (DateTime.now().hour >= 19 || DateTime.now().hour < 7) {
    return "dark";
  }

  return "light";
}

export default function ThemeProvider({
  children,
}: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<Theme>(getThemeBasedOnTimeOfDay());
  const themeClassName = theme === "light" ? classNames.light : classNames.dark;
  // Automatically switch between light and dark based on time of day
  useEffect(() => {
    const handle = window.setInterval(() => {
      setTheme(getThemeBasedOnTimeOfDay());
    }, 5 * MINUTE_IN_MS);

    return () => window.clearTimeout(handle);
  }, []);

  const value: ThemeContextValue = {
    className: cx(classNames.base, themeClassName),
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children(value)}
    </ThemeContext.Provider>
  );
}
