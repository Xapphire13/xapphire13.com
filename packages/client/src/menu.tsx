import "./styles/menu.less";
import * as React from "react";

type MenuProps = {
  isOpen: boolean;
  close: () => void;
  right?: boolean;
  className?: string;
};

type MenuState = {
  width: number;
  display?: string;
};

export class Menu extends React.Component<MenuProps, MenuState> {
  public state: Readonly<MenuState>;

  private childRefs: HTMLDivElement[] = [];
  private ref: HTMLDivElement | undefined;

  constructor(props: MenuProps) {
    super(props);

    this.state = {
      width: 0
    };
  }

  public componentWillReceiveProps(nextProps: MenuProps): void {
    this.setState({display: !nextProps.isOpen ? "none" : undefined});
  }

  public componentDidMount(): void {
    const maxWidth = Math.max(...this.childRefs.map(child => child.clientWidth));
    this.childRefs.forEach(child => child.style.display = "flex");
    this.setState({
      width: maxWidth,
      display: !this.props.isOpen ? "none" : undefined
    });
  }

  public render(): JSX.Element {
    if (!Array.isArray(this.props.children)) {
      throw new Error("Children needs to be an array");
    }

    const trigger = this.props.children.find((child: any) => child.type === MenuTrigger) as React.ReactElement<any>;
    const items = (this.props.children as React.ReactElement<any>[])
      .filter(child => child.type === MenuItem)
      .filter(child => child.props.visible !== false);

    return <div className={this.props.className} style={{position: "relative", display: "inline-block"}} ref={ref => ref && (this.ref = ref)}>
      {trigger}
      <div className="menu" tabIndex={0} ref={ref => this.props.isOpen && ref && ref.focus()} onBlur={() => this.props.close && this.props.close()}
        style={{
          width: this.state.width,
          display: this.state.display,
          [this.props.right ? "right" : "left"]: this.xPos,
          top: this.ref && this.ref.clientHeight
        }}>
        {items.map((child, i) => React.cloneElement(child, {key: i, setRef: (ref: HTMLDivElement) => this.childRefs.push(ref)}))}
      </div>
    </div>;
  }

  get xPos(): number {
    if (this.props.right) {
      return 0;
    }

    const rightPos = (this.ref && this.ref.getBoundingClientRect().left) || 0 + this.state.width;
    const overlap = window.innerWidth - rightPos;
    if (overlap <= 0) {
      return overlap - 3;
    }

    return 0;
  }
}

type MenuTriggerProps = {
  onClick?: () => void;
};

export class MenuTrigger extends React.Component<MenuTriggerProps> {
  public render(): JSX.Element {
    return <div className="menu-trigger" onClick={this.props.onClick}>
      {this.props.children}
    </div>;
  }
}

type MenuItemProps = {
  label: string;
  icon?: (props: {className: string}) => React.ReactElement<any>;
  separator?: boolean;
  disabled?: boolean;
  visible?: boolean;
  setRef?: (ref: HTMLDivElement) => void;
  onClick?: () => void;
};

export class MenuItem extends React.Component<MenuItemProps> {
  public render(): JSX.Element {
    if (this.props.separator) {
      return this.renderSeparator();
    }

    return <div
      className={`menu-item ${this.props.disabled ? "disabled" : ""}`}
      ref={this.props.setRef}
      onClick={!this.props.disabled ? this.props.onClick : undefined}>
      <div className="menu-item-label">{this.props.label}</div>
      {this.props.icon && this.props.icon({className: "menu-item-icon"})}
    </div>;
  }

  private renderSeparator(): JSX.Element {
    return <div className="menu-item-separator" />;
  }
}
