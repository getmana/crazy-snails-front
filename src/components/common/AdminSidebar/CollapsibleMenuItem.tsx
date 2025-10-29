import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from '@/components/ui/sidebar';

import { CollapsibleItem } from './types';

export const CollapsibleMenuItem = ({ item: { title, icon, subItems } }: { item: CollapsibleItem }) => {
    const [isOpen, setIsOpen] = useState(false);

    const pathname = usePathname();

    const IconComponent = icon || null;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild>
                        <button className="flex justify-between">
                            <div className="flex gap-2">
                                {IconComponent ? <IconComponent className="size-4" /> : null}
                                <span>{title}</span>
                            </div>
                            <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                        </button>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {subItems.map(({ title, url = '' }) => (
                            <SidebarMenuSubItem key={title + url}>
                                <SidebarMenuButton asChild isActive={pathname === url}>
                                    <Link href={url}>{title}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};
