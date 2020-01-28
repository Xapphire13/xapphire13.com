import './styles/app-header.less';
import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

const ROUTES: { text: string; path: string; exact?: boolean }[] = [
  {
    text: 'Home',
    path: '/',
    exact: true
  },
  {
    text: 'Projects',
    path: '/projects'
  },
  {
    text: 'Playground',
    path: '/playground'
  }
];

export class AppHeader extends React.Component {
  public render(): JSX.Element {
    return (
      <header className="app-header">
        <Link to="/" className="xapphire13-logo">
          X13
        </Link>
        <nav className="navigation-menu">
          <div className="navigation-menu-content">
            {ROUTES.map((route, i) => (
              <NavLink
                key={route.text}
                className={`navigation-menu-item navigation-menu-item-${i + 1}`}
                activeClassName="selected"
                exact={route.exact}
                to={route.path}
              >
                {route.text}
              </NavLink>
            ))}
          </div>
        </nav>
           </header>;
  }
}
