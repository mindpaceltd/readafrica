
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookHeart, Info, Mail, BookOpen, LogIn, LogOut, Sparkles, Handshake, LayoutDashboard, Gem, ShoppingCart, Menu } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';

const MobileNavContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

export function MobileNav({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <MobileNavContext.Provider value={{ open, setOpen }}>
      <Sheet open={open} onOpenChange={setOpen}>
        {children}
      </Sheet>
    </MobileNavContext.Provider>
  );
}

export function MobileNavTrigger({ children }: { children: React.ReactNode }) {
  return <SheetTrigger asChild>{children}</SheetTrigger>;
}

interface MobileNavContentProps {
  siteTitle?: string | null;
  logoUrl?: string | null;
  user: User | null;
  isAdmin: boolean;
  userRole: 'reader' | 'publisher';
}

export function MobileNavContent({ siteTitle, logoUrl, user, isAdmin, userRole }: MobileNavContentProps) {
  const { setOpen } = React.useContext(MobileNavContext);
  const router = useRouter();
  const { items } = useCart();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/login');
    router.refresh();
  };

  const NavLink = ({ href, children, badgeCount }: {href: string, children: React.ReactNode, badgeCount?: number}) => (
    <Button variant="ghost" className="relative justify-start gap-3 text-lg py-6" asChild>
        <Link href={href} onClick={() => setOpen(false)}>
            {children}
            {badgeCount && badgeCount > 0 && <Badge variant="destructive" className="absolute right-4 top-1/2 -translate-y-1/2">{badgeCount}</Badge>}
        </Link>
    </Button>
  );

  let dashboardHref = '/my-books';
  if (isAdmin) {
      dashboardHref = '/admin';
  } else if (userRole === 'publisher') {
      dashboardHref = '/publisher';
  }

  return (
    <SheetContent side="left" className="w-3/4 bg-primary text-primary-foreground p-4 flex flex-col">
      <SheetHeader>
        <SheetTitle className="mb-8">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            {logoUrl ? (
              <Image src={logoUrl} alt={siteTitle || 'Logo'} width={28} height={28} className="object-contain" />
            ) : (
               <BookHeart className="h-7 w-7 group-hover:text-accent transition-colors" />
            )}
            <span className="text-2xl font-headline group-hover:text-accent transition-colors">
              {siteTitle || 'ReadAfrica'}
            </span>
          </Link>
        </SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col space-y-2 flex-1">
         <NavLink href="/books"><BookOpen/>Books</NavLink>
         {user && <NavLink href={dashboardHref}><LayoutDashboard/>Dashboard</NavLink>}
         <NavLink href="/subscriptions"><Gem />Subscriptions</NavLink>
         <NavLink href="/volunteer"><Handshake/>Volunteer</NavLink>
      </nav>
      <div className="mt-auto">
        {user ? (
            <Button variant="secondary" className="w-full justify-center gap-3" onClick={handleLogout}>
                <LogOut/> Logout
            </Button>
        ) : (
            <Button variant="secondary" className="w-full justify-center gap-3" asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                    <LogIn/> Login / Register
                </Link>
            </Button>
        )}
      </div>
    </SheetContent>
  );
}
