import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@acme/ui";

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Accounts",
        url: "/accounts",
        icon: Inbox,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar className="fixed h-screen w-64">
            <SidebarHeader>
                <h2 className="p-4 text-xl font-bold">NestEgg Wallet</h2>
            </SidebarHeader>
            <SidebarContent className="m-3">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <p className="p-4 text-sm text-gray-500">v1.0.0</p>
            </SidebarFooter>
        </Sidebar>
    );
}
