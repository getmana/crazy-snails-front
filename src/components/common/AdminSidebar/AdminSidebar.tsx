'use client';

import { Aperture, BookText, BookType, Camera, Image, LucideIcon, Settings, SquareUserRound, Tent } from 'lucide-react';
import Link from 'next/link';

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

export type MenuItem = {
    title: string;
    icon?: LucideIcon;
    url?: string;
};

export type ColapsibleItem = MenuItem & {
    subItems: MenuItem[];
};

export function AdminSidebar({ locale }: { locale: Locale }) {
    const dictionary = useDictionary();
    const contentItems: ColapsibleItem[] = [
        {
            title: 'Albums',
            icon: Camera,
            subItems: [
                { title: 'List Albums', url: `/${locale}/dashboard/albums` },
                { title: 'Create New Album', url: `/${locale}/dashboard/create-album` },
            ],
        },
        {
            title: 'Stories',
            icon: BookType,
            subItems: [
                { title: 'List Stories', url: `/${locale}/dashboard/stories` },
                { title: 'Create New Story', url: `/${locale}/dashboard/create-story` },
            ],
        },
        {
            title: 'Custom Section',
            icon: Tent,
            subItems: [
                { title: 'Section Settings', url: `/${locale}/dashboard/custom` },
                { title: 'Custom Album', url: `/${locale}/dashboard/custom-album` },
            ],
        },
        {
            title: 'Photos',
            icon: Image,
            subItems: [
                { title: 'List Photos', url: `/${locale}/dashboard/photos` },
                { title: 'Upload Photo', url: `/${locale}/dashboard/upload-photo` },
            ],
        },
    ];

    const pageItems = [
        {
            title: 'Albums',
            url: `/${locale}/albums`,
            icon: Aperture,
        },
        {
            title: 'Stories',
            url: `/${locale}/stories`,
            icon: BookText,
        },
        {
            title: 'Grandpa',
            url: `/${locale}/grandpa`,
            icon: Tent,
        },
    ];

    const accountItems = [
        {
            title: 'Account Data',
            url: `/${locale}/dashboard/account`,
            icon: SquareUserRound,
        },
        {
            title: 'Settings',
            url: `/${locale}/dashboard/settings`,
            icon: Settings,
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href={`/${locale}`}>
                    <Icon icon="Logo" className={`h-16 w-48`} />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>My Content</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {contentItems.map((item) => (
                                <CollapsibleMenuItem item={item} key={item.title} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Site Pages</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {pageItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>My Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
