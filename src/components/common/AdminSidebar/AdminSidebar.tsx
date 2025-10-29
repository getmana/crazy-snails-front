'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useDictionary } from '@/context';
import { Locale } from '@/i18n-config';

import { CollapsibleMenuItem } from './CollapsibleMenuItem';
import { getSidebarConfig } from './config';
import { isCollapsibleItem } from './types';

export function AdminSidebar({ locale }: { locale: Locale }) {
    const dictionary = useDictionary();
    const menuSections = getSidebarConfig(locale, dictionary);
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href={`/${locale}`}>
                    <Icon icon="Logo" className={`h-16 w-48`} />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {menuSections.map(({ title, items }) => (
                    <SidebarGroup key={title}>
                        <SidebarGroupLabel>{title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) =>
                                    isCollapsibleItem(item) ? (
                                        <CollapsibleMenuItem item={item} key={item.title} />
                                    ) : (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={pathname === item.url}>
                                                <Link href={item.url || ''}>
                                                    {item.icon ? <item.icon /> : null}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ),
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}
