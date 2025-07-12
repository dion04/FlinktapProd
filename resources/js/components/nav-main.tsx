import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isItemActive = item.href === page.url;
                    const hasActiveChild = hasChildren && item.children!.some((child) => child.href === page.url);

                    if (hasChildren) {
                        return (
                            <Collapsible key={item.title} asChild defaultOpen={hasActiveChild}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip={{ children: item.title }} isActive={isItemActive || hasActiveChild}>
                                        <CollapsibleTrigger>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </CollapsibleTrigger>
                                    </SidebarMenuButton>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.children!.map((child) => (
                                                <SidebarMenuSubItem key={child.title}>
                                                    <SidebarMenuSubButton asChild isActive={child.href === page.url}>
                                                        <Link href={child.href} prefetch>
                                                            {child.icon && <child.icon />}
                                                            <span>{child.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isItemActive} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
