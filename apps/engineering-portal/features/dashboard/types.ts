import { LucideIcon } from 'lucide-react';

export interface SideBarNormalItemprops {
  collapsible: false;
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface SideBarCollapsibleItemprops {
  collapsible: true;
  title: string;
  icon: LucideIcon;
  subItems: { label: string; href: string }[];
}

export type SideBarMenus = {
  header: string;
  items: (SideBarNormalItemprops | SideBarCollapsibleItemprops)[];
}[];
