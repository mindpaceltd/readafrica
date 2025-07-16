
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
import { BookHeart, Info, Mail, BookOpen, LogIn, Sparkles, Handshake, LayoutDashboard } from 'lucide-react';

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

export function MobileNavContent() {
  const { setOpen } = React.useContext(MobileNavContext);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Simulate checking login status
     if (typeof window !== 'undefined') {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);
    }
  }, []);

  const NavLink = ({ href, children }: {href: string, children: React.ReactNode}) => (
    <Button variant="ghost" className="justify-start gap-3 text-lg py-6" asChild>
        <Link href={href} onClick={() => setOpen(false)}>
            {children}
        </Link>
    </Button>
  )

  return (
    <SheetContent side="left" className="w-3/4 bg-primary text-primary-foreground p-4">
      <SheetHeader>
        <SheetTitle className="mb-8">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <BookHeart className="h-7 w-7 group-hover:text-accent transition-colors" />
            <span className="text-2xl font-headline group-hover:text-accent transition-colors">
              Prophetic Reads
            </span>
          </Link>
        </SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col space-y-2">
         <NavLink href="/books"><BookOpen/>Books</NavLink>
         {isLoggedIn && <NavLink href="/dashboard"><LayoutDashboard/>Dashboard</NavLink>}
         <NavLink href="/devotionals"><Sparkles/>Devotionals</NavLink>
         <NavLink href="/volunteer"><Handshake/>Volunteer</NavLink>
         <NavLink href="/#about"><Info/>About</NavLink>
         <NavLink href="/#contact"><Mail/>Contact</NavLink>
      </nav>
      <div className="absolute bottom-4 right-4 left-4">
        <Button className="w-full justify-center gap-3" asChild>
            <Link href="/login" onClick={() => setOpen(false)}>
                <LogIn/>
                {isLoggedIn ? "Logout" : "Login / Register"}
            </Link>
        </Button>
      </div>
    </SheetContent>
  );
}
