import { SideBarMenus } from '@/features/dashboard/types';
import { BookOpen, Bug, Home, LayoutDashboard, Mails } from 'lucide-react';

export const sideBarContent: SideBarMenus = [
  {
    header: 'UI Elements',
    items: [
      {
        title: 'Components',
        collapsible: true,
        icon: LayoutDashboard,
        subItems: [
          {
            label: 'Image Carousel',
            href: '#',
          },
          {
            label: 'Experience Cards',
            href: '#',
          },
          {
            label: 'Latest News',
            href: '#',
          },
          {
            label: 'our Services',
            href: '#',
          },
        ],
      },
      {
        collapsible: true,
        title: 'Pages',
        icon: BookOpen,
        subItems: [
          {
            label: 'Locations',
            href: '#',
          },
          {
            label: 'About Us',
            href: '#',
          },
          {
            label: 'Contact Us',
            href: '#',
          },
        ],
      },
    ],
  },

  {
    header: 'Support',
    items: [
      {
        label: 'Messages',
        href: '/admin/dashboard/messages',
        collapsible: false,
        icon: Mails,
      },
      {
        label: 'Issues',
        href: '/admin/dashboard/issues',
        collapsible: false,
        icon: Bug,
      },
    ],
  },
];
