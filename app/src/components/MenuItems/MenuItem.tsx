import React from "react";

interface MenuItemIconProps {
  children: Exclude<React.ReactNode, string>;
  label: string;
}

interface MenuItemTextProps {
  children: string;
}

export type MenuItemProps = MenuItemTextProps | MenuItemIconProps;

export default function MenuItem({
  children,
  ...rest
}: MenuItemProps): JSX.Element {
  return (
    <li>
      <button type="button">{children}</button>
    </li>
  );
}
