import { JSX } from 'react';

import { ChevronDown } from 'lucide-react';

import Link from 'next/link';

import {
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { SideBarCollapsibleItemprops } from '@/features/dashboard/types';

export const SideBarCollapsibleItem = ({
  label,
  href,
}: {
  label: string;
  href: string;
}): JSX.Element => (
  <SidebarMenuSubItem>
    <SidebarMenuSubButton asChild>
      <Link href={href}>{label}</Link>
    </SidebarMenuSubButton>
  </SidebarMenuSubItem>
);

export const SideBarCollapsibleWrapper = ({
  title,
  icon: Icon,
  subItems,
}: SideBarCollapsibleItemprops): JSX.Element => (
  <Collapsible defaultOpen className="group/collapsible">
    <SidebarMenuButton asChild tooltip="Dashboard">
      <CollapsibleTrigger className="flex w-full items-center justify-between group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center">
          <Icon className="h-4 w-4 shrink-0 transition-all duration-200 group-data-[collapsible=icon]:mr-0 mr-2" />
          <span className="group-data-[collapsible=icon]:hidden">{title}</span>
        </div>
        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
      </CollapsibleTrigger>
    </SidebarMenuButton>

    <CollapsibleContent>
      <SidebarMenuSub>
        {subItems.map((item, index) => (
          <SideBarCollapsibleItem key={item.label + index} {...item} />
        ))}
      </SidebarMenuSub>
    </CollapsibleContent>
  </Collapsible>
);
