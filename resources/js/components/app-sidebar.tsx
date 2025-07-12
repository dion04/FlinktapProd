import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookKey, LayoutGrid, Package, Settings, UserCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Helper functions to check user roles
    const isAdmin = user.role === 'admin' || user.role === 'superadmin';
    const isSuperAdmin = user.role === 'superadmin';

    // Base navigation items (available to all users)
    const baseNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Admin submenu items
    const adminSubmenuItems: NavItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Resolve Codes',
            href: '/admin/resolve-codes',
            icon: BookKey,
        },
        {
            title: 'Profiles',
            href: '/admin/profiles',
            icon: UserCheck,
        },
        {
            title: 'Batches',
            href: '/admin/batches',
            icon: Package,
        },
        ...(isSuperAdmin
            ? [
                  {
                      title: 'User Management',
                      href: '/admin/users',
                      icon: Users,
                  },
              ]
            : []),
    ];

    // Admin navigation items (available to admins and super admins)
    const adminNavItems: NavItem[] = isAdmin
        ? [
              {
                  title: 'Administration',
                  href: '/admin',
                  icon: Settings,
                  children: adminSubmenuItems,
              },
          ]
        : [];

    // Build the navigation items array based on user role
    const mainNavItems: NavItem[] = [...baseNavItems, ...adminNavItems];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
