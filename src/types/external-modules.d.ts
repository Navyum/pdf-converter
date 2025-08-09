// 外部模块类型声明
declare module 'react-dropzone' {
  import { ReactNode } from 'react';

  export interface DropzoneProps {
    onDrop: (files: File[]) => void;
    multiple?: boolean;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export default function Dropzone(props: DropzoneProps): JSX.Element;
}

declare module 'react-icons/fa' {
  import { IconType } from 'react-icons';
  export const FaCloudUpload: IconType;
}

declare module 'react-bootstrap/lib/Alert' {
  import { ComponentClass } from 'react';

  interface AlertProps {
    bsStyle?: 'success' | 'warning' | 'danger' | 'info';
    children?: React.ReactNode;
  }

  const Alert: ComponentClass<AlertProps>;
  export default Alert;
}

declare module 'react-bootstrap/lib/ButtonToolbar' {
  import { ComponentClass } from 'react';

  interface ButtonToolbarProps {
    children?: React.ReactNode;
    className?: string;
  }

  const ButtonToolbar: ComponentClass<ButtonToolbarProps>;
  export default ButtonToolbar;
}

declare module 'react-bootstrap/lib/ButtonGroup' {
  import { ComponentClass } from 'react';

  interface ButtonGroupProps {
    bsSize?: 'large' | 'medium' | 'small';
    children?: React.ReactNode;
    className?: string;
  }

  const ButtonGroup: ComponentClass<ButtonGroupProps>;
  export default ButtonGroup;
}

declare module 'react-bootstrap/lib/Button' {
  import { ComponentClass } from 'react';

  interface ButtonProps {
    onClick?: () => void;
    className?: string;
    bsStyle?: 'primary' | 'default' | 'success' | 'warning' | 'danger';
    bsSize?: 'large' | 'medium' | 'small';
  }

  const Button: ComponentClass<ButtonProps>;
  export default Button;
}

declare module 'react-bootstrap/lib/Navbar' {
  import { ComponentClass } from 'react';

  interface NavbarProps {
    inverse?: boolean;
    children?: React.ReactNode;
    className?: string;
  }

  interface NavbarHeaderProps {
    children?: React.ReactNode;
  }

  interface NavbarBrandProps {
    children?: React.ReactNode;
  }

  interface NavbarCollapseProps {
    children?: React.ReactNode;
  }

  interface NavbarTextProps {
    pullRight?: boolean;
    children?: React.ReactNode;
  }

  const Navbar: ComponentClass<NavbarProps> & {
    Header: ComponentClass<NavbarHeaderProps>;
    Brand: ComponentClass<NavbarBrandProps>;
    Collapse: ComponentClass<NavbarCollapseProps>;
    Text: ComponentClass<NavbarTextProps>;
  };

  export default Navbar;
}

declare module 'react-bootstrap/lib/Nav' {
  import { ComponentClass } from 'react';

  interface NavProps {
    bsStyle?: 'tabs' | 'pills';
    activeKey?: string | number;
    pullRight?: boolean;
    children?: React.ReactNode;
  }

  const Nav: ComponentClass<NavProps>;
  export default Nav;
}

declare module 'react-bootstrap/lib/NavItem' {
  import { ComponentClass } from 'react';

  interface NavItemProps {
    eventKey?: string | number;
    activeKey?: string | number;
    onSelect?: (eventKey: string | number) => void;
    children?: React.ReactNode;
  }

  const NavItem: ComponentClass<NavItemProps>;
  export default NavItem;
}

declare module 'react-bootstrap/lib/MenuItem' {
  import { ComponentClass } from 'react';

  interface MenuItemProps {
    divider?: boolean;
    href?: string;
    target?: string;
    eventKey?: string | number;
    children?: React.ReactNode;
  }

  const MenuItem: ComponentClass<MenuItemProps>;
  export default MenuItem;
}

declare module 'react-bootstrap/lib/Dropdown' {
  import { ComponentClass } from 'react';

  interface DropdownProps {
    id: string;
    children?: React.ReactNode;
  }

  interface DropdownMenuProps {
    children?: React.ReactNode;
  }

  const Dropdown: ComponentClass<DropdownProps> & {
    Menu: ComponentClass<DropdownMenuProps>;
  };

  export default Dropdown;
}

declare module 'react-bootstrap/lib/Popover' {
  import { ComponentClass } from 'react';

  interface PopoverProps {
    id: string;
    title?: string;
    children?: React.ReactNode;
  }

  const Popover: ComponentClass<PopoverProps>;
  export default Popover;
}

declare module 'react-bootstrap/lib/OverlayTrigger' {
  import { ComponentClass } from 'react';

  interface OverlayTriggerProps {
    trigger: string | string[];
    rootClose?: boolean;
    placement?: string;
    overlay: React.ReactNode;
    children?: React.ReactNode;
  }

  const OverlayTrigger: ComponentClass<OverlayTriggerProps>;
  export default OverlayTrigger;
}

declare module 'remarkable' {
  export interface RemarkableOptions {
    breaks?: boolean;
    html?: boolean;
  }

  export class Remarkable {
    constructor(options?: RemarkableOptions);
    render(text: string): string;
  }
} 