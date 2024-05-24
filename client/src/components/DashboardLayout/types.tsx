export type SideNavItem = {
  title: string;
  path: string;
  icon?: React.FC<any>;
  childPath?: string[];
  subMenuItems?: SideNavItem[];
}