
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
import { BookHeart, Info, Mail, BookOpen, LogIn, LogOut, Sparkles, Handshake, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


type Profile = {
    is_admin: boolean;
} | null;

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
}

export function MobileNavContent({ siteTitle, logoUrl }: MobileNavContentProps) {
  const { open, setOpen } = React.useContext(MobileNavContext);
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<Profile>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    const checkUser = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            const { data: profileData } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
            setProfile(profileData);
        }
        setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
            const { data: profileData } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
            setProfile(profileData);
        } else {
            setProfile(null);
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/login');
    router.refresh();
  };

  const NavLink = ({ href, children }: {href: string, children: React.ReactNode}) => (
    <Button variant="ghost" className="justify-start gap-3 text-lg py-6" asChild>
        <Link href={href} onClick={() => setOpen(false)}>
            {children}
        </Link>
    </Button>
  );

  const dashboardHref = profile?.is_admin ? '/admin' : '/my-books';

  return (
    <SheetContent side="left" className="w-3/4 bg-primary text-primary-foreground p-4 flex flex-col">
      <SheetHeader>
        <SheetTitle className="mb-8">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            {logoUrl ? (
              <Image src={logoUrl} alt={siteTitle || 'Logo'} width={28} height={28} className="h-7 w-7 object-contain"/>
            ) : (
               <BookHeart className="h-7 w-7 group-hover:text-accent transition-colors" />
            )}
            <span className="text-2xl font-headline group-hover:text-accent transition-colors">
              {siteTitle || 'Prophetic Reads'}
            </span>
          </Link>
        </SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col space-y-2 flex-1">
         <NavLink href="/books"><BookOpen/>Books</NavLink>
         {user && <NavLink href={dashboardHref}><LayoutDashboard/>Dashboard</NavLink>}
         <NavLink href="/devotionals"><Sparkles/>Devotionals</NavLink>
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
