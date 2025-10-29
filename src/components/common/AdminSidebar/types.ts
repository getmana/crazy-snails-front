import { LucideIcon } from 'lucide-react';

export type BaseMenuItem = {
    title: string;
    icon?: LucideIcon;
    url?: string;
};

export type CollapsibleItem = BaseMenuItem & {
    type: 'collapsible';
    subItems: BaseMenuItem[];
};

export type RegularMenuItem = BaseMenuItem & {
    type: 'regular';
};

export type MenuItem = RegularMenuItem | CollapsibleItem;

export type MenuSection = {
    title: string;
    items: MenuItem[];
};

export const isCollapsibleItem = (item: MenuItem): item is CollapsibleItem => item.type === 'collapsible';
