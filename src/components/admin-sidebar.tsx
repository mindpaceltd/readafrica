// src/components/admin-sidebar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, LayoutDashboard, MessageCircle, Settings, ShoppingCart, Users, BookHeart, Menu, Bell, Gem, FileClock, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/books", label: "Manage Books", icon: BookMarked, subItems: [
        { href: "/admin/books/categories", label: "Book Categories", icon: FolderKanban },
    ]},
    { href: "/admin/subscriptions", label: "Subscription Plans", icon: Gem },
    { href: "/admin/devotionals", label: "Devotionals", icon: MessageCircle },
    { href: "/admin/transactions", label: "Transactions", icon: ShoppingCart },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/activity-logs", label: "Activity Logs", icon: FileClock },
  ];

export function AdminSidebar() {
    return (
        <>
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 w-64 flex-col border-r bg-background">
                <nav className="flex flex-col gap-4 p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold mb-4"
                        >
                        <BookHeart className="h-6 w-6 text-primary" />
                        <span>Prophetic Reads</span>
                    </Link>
                    <NavLinks />
                </nav>
            </aside>
            <header className="md:hidden flex items-center h-14 px-4 border-b bg-background sticky top-0 z-30">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                        <nav className="grid gap-2 text-lg font-medium">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-lg font-semibold mb-4"
                                >
                                <BookHeart className="h-6 w-6 text-primary" />
                                <span>Prophetic Reads</span>
                            </Link>
                            <NavLinks />
                        </nav>
                    </SheetContent>
                </Sheet>
                 <div className="flex-1 text-center">
                    <h1 className="text-lg font-semibold">Admin</h1>
                </div>
            </header>
        </>
    )
}

function NavLinks() {
    const pathname = usePathname();
    const isExactDashboard = pathname === "/admin";
    
    return (
        <>
            {navItems.map((item) => (
                <div key={item.href}>
                    <Link
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin') ? "bg-muted text-primary" : ""
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                    {item.subItems && pathname.startsWith(item.href) && (
                         <div className="ml-7 mt-2 space-y-2 border-l pl-4">
                            {item.subItems.map((subItem) => (
                                <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary",
                                        pathname.startsWith(subItem.href) ? "text-primary font-semibold" : ""
                                    )}
                                >
                                     <subItem.icon className="h-4 w-4" />
                                    {subItem.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </>
    )
}
