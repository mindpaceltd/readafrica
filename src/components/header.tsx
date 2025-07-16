
'use client';

import { BookHeart, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MobileNavTrigger } from "./mobile-nav";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Profile = {
    is_admin: boolean;
} | null;

interface HeaderProps {
  siteTitle?: string | null;
  logoUrl?: string | null;
}

export function Header({ siteTitle, logoUrl }: HeaderProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const supabase = createClient();
    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single();
            setProfile(profileData);
        }
    }
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
             const { data: profileData } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', session.user.id)
                .single();
            setProfile(profileData);
        } else {
            setProfile(null);
        }
        router.refresh();
    });

    return () => {
        window.removeEventListener('scroll', handleScroll);
        authListener.subscription.unsubscribe();
    }
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const dashboardHref = profile?.is_admin ? '/admin' : '/my-books';

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
          <Button variant="ghost" className="hover:text-primary" asChild>
             <Link href="/books">Books</Link>
          </Button>
           <Button variant="ghost" className="hover:text-primary" asChild>
             <Link href="/devotionals">Devotionals</Link>
          </Button>
           <Button variant="ghost" className="hover:text-primary" asChild>
             <Link href="/volunteer">Volunteer</Link>
          </Button>
          {user && (
            <Button variant="ghost" className="hover:text-primary" asChild>
                <Link href={dashboardHref}><LayoutDashboard className="mr-2"/>Dashboard</Link>
            </Button>
          )}
           <Button className="text-primary-foreground bg-primary hover:bg-primary/90" asChild={!user} onClick={user ? handleLogout : undefined}>
             {user ? <span>Logout</span> : <Link href="/login">Login</Link>}
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
