
// src/components/user-sidebar.tsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, LayoutDashboard, History, Bell, User, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useEffect, useState } from "react";

const navItems = [
    { href: "/my-books", label: "Dashboard", icon: LayoutDashboard },
    { href: "/my-books/history", label: "Purchase History", icon: History },
    { href: "/my-books/notifications", label: "Notifications", icon: Bell },
    { href: "/my-books/profile", label: "Profile", icon: User },
  ];

export function UserSidebar() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const isExactDashboard = isMounted && pathname === "/my-books";

    const checkActive = (itemHref: string) => {
        if (!isMounted) return false;
        if (itemHref === "/my-books") return isExactDashboard;
        return pathname.startsWith(itemHref);
    };

    return (
        <>
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 w-64 flex-col border-r bg-background">
                <nav className="flex flex-col gap-4 p-4">
                     <h2 className="text-lg font-semibold px-3 py-2">My Account</h2>
                     {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                checkActive(item.href) && "bg-muted text-primary"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto p-4">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
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
                        <SheetHeader>
                            <SheetTitle className="text-left text-lg font-semibold">My Account</SheetTitle>
                        </SheetHeader>
                        <nav className="grid gap-2 text-lg font-medium mt-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                        checkActive(item.href) && "bg-muted text-primary"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                         <div className="mt-auto">
                            <Button variant="ghost" className="w-full justify-start gap-3 text-lg py-6">
                                <LogOut className="h-5 w-5" />
                                Logout
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
                 <div className="flex-1 text-center font-semibold">
                    My Account
                </div>
            </header>
        </>
    )
}
