import "./styles/app.less";
import * as React from "react";

export class App extends React.Component {
  public render(): JSX.Element {
    return <div className="app">
      <header className="app-header">
        <div className="xapphire13-logo">
          X13
        </div>
        <nav className="navigation-menu">
          <div className="navigation-menu-content">
            <div className="navigation-menu-item navigation-menu-item-1 selected">Home</div>
            <div className="navigation-menu-item navigation-menu-item-2">Projects</div>
          </div>
        </nav>
      </header>
    </div>;
  }
}
