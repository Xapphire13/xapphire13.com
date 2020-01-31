import './styles/button.less';
import React from 'react';

type Props = {
  text: string;
  icon?: (props: React.HTMLAttributes<any>) => JSX.Element;
  onClick?: () => void;
};

export default function Button({ onClick, text, icon }: Props) {
  return (
    <button className="button" onClick={onClick} type="button">
      {icon && icon({ className: 'button-icon' })}
      <span className="button-text">{text}</span>
    </button>
  );
}
