declare module 'react-bootstrap' {
  import React from 'react';

  export interface ButtonProps {
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
    bsSize?: string;
    disabled?: boolean;
  }

  export interface ButtonGroupProps {
    bsSize?: string;
    children?: React.ReactNode;
    className?: string;
  }

  export interface ButtonToolbarProps {
    children?: React.ReactNode;
  }

  export interface GridProps {
    children?: React.ReactNode;
  }

  export interface NavbarProps {
    inverse?: boolean;
    children?: React.ReactNode;
  }

  export interface NavProps {
    bsStyle?: string;
    activeKey?: any;
    pullRight?: boolean;
    children?: React.ReactNode;
  }

  export interface NavItemProps {
    eventKey?: any;
    activeKey?: any;
    onSelect?: (eventKey: any) => void;
    children?: React.ReactNode;
  }

  export interface MenuItemProps {
    divider?: boolean;
    href?: string;
    target?: string;
    eventKey?: any;
    onSelect?: (eventKey: any) => void;
    children?: React.ReactNode;
  }

  export interface DropdownProps {
    id?: string;
    children?: React.ReactNode;
  }

  export interface PopoverProps {
    id?: string;
    title?: string;
    children?: React.ReactNode;
  }

  export interface OverlayTriggerProps {
    trigger?: string;
    rootClose?: boolean;
    placement?: string;
    overlay?: React.ReactElement;
    children?: React.ReactNode;
  }

  export interface PaginationProps {
    prev?: boolean;
    next?: boolean;
    first?: boolean;
    last?: boolean;
    ellipsis?: boolean;
    boundaryLinks?: boolean;
    items?: number;
    maxButtons?: number;
    activePage?: number;
    onSelect?: (page: number) => void;
    children?: React.ReactNode;
  }

  export interface LabelProps {
    bsStyle?: string;
    children?: React.ReactNode;
  }

  export interface CheckboxProps {
    onClick?: () => void;
    children?: React.ReactNode;
  }

  export interface CollapseProps {
    in?: boolean;
    children?: React.ReactNode;
  }

  export interface PanelProps {
    bsStyle?: string;
    children?: React.ReactNode;
  }

  export interface DropdownButtonProps {
    title?: string;
    id?: string;
    children?: React.ReactNode;
  }

  export interface AlertProps {
    bsStyle?: string;
    children?: React.ReactNode;
  }

  export const Button: React.ComponentType<ButtonProps>;
  export const ButtonGroup: React.ComponentType<ButtonGroupProps>;
  export const ButtonToolbar: React.ComponentType<ButtonToolbarProps>;
  export const Grid: React.ComponentType<GridProps>;
  export const Navbar: React.ComponentType<NavbarProps> & {
    Header: React.ComponentType<{ children?: React.ReactNode }>;
    Brand: React.ComponentType<{ children?: React.ReactNode }>;
    Collapse: React.ComponentType<{ children?: React.ReactNode }>;
    Text: React.ComponentType<{ pullRight?: boolean; children?: React.ReactNode }>;
  };
  export const Nav: React.ComponentType<NavProps>;
  export const NavItem: React.ComponentType<NavItemProps>;
  export const MenuItem: React.ComponentType<MenuItemProps>;
  export const Dropdown: React.ComponentType<DropdownProps> & {
    Menu: React.ComponentType<{ children?: React.ReactNode }>;
    Toggle: React.ComponentType<{ children?: React.ReactNode; id?: string; variant?: string; className?: string }>;
    Item: React.ComponentType<{ eventKey?: any; onSelect?: () => void; onClick?: () => void; children?: React.ReactNode; className?: string }>;
  };
  export const Popover: React.ComponentType<PopoverProps>;
  export const OverlayTrigger: React.ComponentType<OverlayTriggerProps>;
  export const Pagination: React.ComponentType<PaginationProps> & {
    First: React.ComponentType<{ disabled?: boolean; onClick?: () => void }>;
    Prev: React.ComponentType<{ disabled?: boolean; onClick?: () => void }>;
    Next: React.ComponentType<{ disabled?: boolean; onClick?: () => void }>;
    Last: React.ComponentType<{ disabled?: boolean; onClick?: () => void }>;
    Ellipsis: React.ComponentType<{ disabled?: boolean }>;
    Item: React.ComponentType<{ active?: boolean; onClick?: () => void; children?: React.ReactNode }>;
  };
  export const Label: React.ComponentType<LabelProps>;
  export const Checkbox: React.ComponentType<CheckboxProps>;
  export const Collapse: React.ComponentType<CollapseProps>;
  export const Panel: React.ComponentType<PanelProps>;
  export const DropdownButton: React.ComponentType<DropdownButtonProps>;
  export const Alert: React.ComponentType<AlertProps>;

  // v2 组件：Form、Card（最简声明，满足用法）
  export const Form: React.ComponentType<any> & {
    Label: React.ComponentType<any>;
    Check: React.ComponentType<any>;
  };
  export const Card: React.ComponentType<any>;
} 