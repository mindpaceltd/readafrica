
'use client';

import { BookHeart, LayoutDashboard, Menu, Gem, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MobileNavTrigger } from "./mobile-nav";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/cart-context";
import { Badge } from "./ui/badge";

interface HeaderProps {
  siteTitle?: string | null;
  logoUrl?: string | null;
  user: User | null;
  isAdmin: boolean;
  userRole: 'reader' | 'publisher';
}

export function Header({ siteTitle, logoUrl, user, isAdmin, userRole }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { items } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    handleScroll();

    return () => {
        window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleLogin = () => {
    router.push('/login');
  }

  let dashboardHref = '/my-books';
  if (isAdmin) {
      dashboardHref = '/admin';
  } else if (userRole === 'publisher') {
      dashboardHref = '/publisher';
  }
  
  const navItems = [
      { href: "/books", label: "Books" },
      { href: "/volunteer", label: "Volunteer" },
  ]

  return (
    <header className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
      )}>
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 group">
          {logoUrl ? (
             <Image src={logoUrl} alt={siteTitle || 'Logo'} width={32} height={32} className="h-7 w-7 md:h-8 md:w-8 object-contain"/>
          ) : (
            <BookHeart className="text-primary h-7 w-7 md:h-8 md:w-8 group-hover:text-accent transition-colors" />
          )}
          <h1 className="text-2xl md:text-3xl font-headline text-primary group-hover:text-accent transition-colors">
            {siteTitle || 'Prophetic Reads'}
          </h1>
        </Link>
        <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
                 <Button key={item.href} variant="ghost" asChild className={cn("hover:text-primary", pathname === item.href ? 'text-primary font-semibold' : '')}>
                    <Link href={item.href}>{item.label}</Link>
                </Button>
            ))}
          {user && (
            <Button variant="ghost" className={cn("hover:text-primary", pathname.startsWith(dashboardHref) ? 'text-primary font-semibold' : '')} asChild>
                <Link href={dashboardHref}><LayoutDashboard className="mr-2"/>Dashboard</Link>
            </Button>
          )}
           <Button variant="secondary" asChild>
                <Link href="/subscriptions">
                    <Gem className="mr-2" />
                    Subscribe
                </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/cart">
                    <ShoppingCart />
                    {items.length > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 justify-center rounded-full">{items.length}</Badge>}
                    <span className="sr-only">Cart</span>
                </Link>
            </Button>
           <Button className="text-primary-foreground bg-primary hover:bg-primary/90" onClick={user ? handleLogout : handleLogin}>
             {user ? <span>Logout</span> : <span>Login</span>}
           </Button>
        </div>
        <div className="md:hidden">
          <MobileNavTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-accent/20"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </MobileNavTrigger>
        </div>
      </div>
    </header>
  );
}
