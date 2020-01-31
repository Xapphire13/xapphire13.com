/* eslint max-classes-per-file: warn */
import './styles/menu.less';
import React from 'react';

type MenuTriggerProps = {
  onClick?: () => void;
  children: React.ReactNode;
};

export function MenuTrigger({ onClick, children }: MenuTriggerProps) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="menu-trigger" onClick={onClick}>
      {children}
    </div>
  );
}

function Separator() {
  return <div className="menu-item-separator" />;
}

type MenuItemProps = {
  label: string;
  icon?: (props: { className: string }) => React.ReactElement<any>;
  separator?: boolean;
  disabled?: boolean;
  visible?: boolean;
  setRef?: (ref: HTMLDivElement) => void;
  onClick?: () => void;
};

export class MenuItem extends React.Component<MenuItemProps> {
  public render(): JSX.Element {
    const { separator, label, disabled, icon, onClick, setRef } = this.props;

    if (separator) {
      return <Separator />;
    }

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        className={`menu-item ${disabled ? 'disabled' : ''}`}
        ref={setRef}
        onClick={!disabled ? onClick : undefined}
      >
        <div className="menu-item-label">{label}</div>
        {icon && icon({ className: 'menu-item-icon' })}
      </div>
    );
  }
}

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
  private childRefs: HTMLDivElement[] = [];

  private ref: HTMLDivElement | undefined;

  constructor(props: MenuProps) {
    super(props);

    this.state = {
      width: 0
    };
  }

  public componentDidMount(): void {
    const { isOpen } = this.props;
    const maxWidth = Math.max(
      ...this.childRefs.map(child => child.clientWidth)
    );
    this.childRefs.forEach(child => {
      // eslint-disable-next-line no-param-reassign
      child.style.display = 'flex';
    });
    this.setState({
      width: maxWidth,
      display: !isOpen ? 'none' : undefined
    });
  }

  public UNSAFE_componentWillReceiveProps(nextProps: MenuProps): void {
    this.setState({ display: !nextProps.isOpen ? 'none' : undefined });
  }

  get xPos(): number {
    const { right } = this.props;
    const { width } = this.state;

    if (right) {
      return 0;
    }

    const rightPos =
      (this.ref && this.ref.getBoundingClientRect().left) || 0 + width;
    const overlap = window.innerWidth - rightPos;
    if (overlap <= 0) {
      return overlap - 3;
    }

    return 0;
  }

  public render(): JSX.Element {
    const { children, close, isOpen, className, right } = this.props;
    const { width, display } = this.state;

    if (!Array.isArray(children)) {
      throw new Error('Children needs to be an array');
    }

    const trigger = children.find(
      (child: any) => child.type === MenuTrigger
    ) as React.ReactElement<any>;
    const items = (children as React.ReactElement<any>[])
      .filter(child => child.type === MenuItem)
      .filter(child => child.props.visible !== false);

    return (
      <div
        className={className}
        style={{ position: 'relative', display: 'inline-block' }}
        ref={ref => {
          if (ref) this.ref = ref;
        }}
      >
        {trigger}
        <div
          className="menu"
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          ref={ref => isOpen && ref && ref.focus()}
          onBlur={() => close && close()}
          style={{
            width,
            display,
            [right ? 'right' : 'left']: this.xPos,
            top: this.ref && this.ref.clientHeight
          }}
        >
          {items.map((child, i) =>
            React.cloneElement(child, {
              // eslint-disable-next-line react/no-array-index-key
              key: i,
              setRef: (ref: HTMLDivElement) => this.childRefs.push(ref)
            })
          )}
        </div>
      </div>
    );
  }
}
