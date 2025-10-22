import { Aperture, BookText, BookType, Camera, Image, Settings, SquareUserRound, Tent } from 'lucide-react';
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
import { Locale } from '@/i18n-config';

export function AdminSidebar({ locale }: { locale: Locale }) {
    const contentItems = [
        {
            title: 'Albums',
            url: `/${locale}/dashboard/albums`,
            icon: Camera,
        },
        {
            title: 'Stories',
            url: `/${locale}/dashboard/stories`,
            icon: BookType,
        },
        {
            title: 'Grandpa',
            url: `/${locale}/dashboard/custom`,
            icon: Tent,
        },
        {
            title: 'Photos',
            url: `/${locale}/dashboard/photos`,
            icon: Image,
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
