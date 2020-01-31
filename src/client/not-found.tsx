import './styles/not-found.less';
import React from 'react';

type Props = {
  message?: string;
};

export default function NotFound({ message }: Props) {
  return (
    <div className="not-found">
      <h1>{message ?? "404: This is not the page you're looking for"}</h1>
    </div>
  );
}
