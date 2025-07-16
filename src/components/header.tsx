
'use client';

import { BookHeart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MobileNavTrigger } from "./mobile-nav";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent border-b border-transparent"
      )}>
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 group">
          <BookHeart className="text-primary h-7 w-7 md:h-8 md:w-8 group-hover:text-accent transition-colors" />
          <h1 className="text-2xl md:text-3xl font-headline text-primary group-hover:text-accent transition-colors">
            Prophetic Reads
          </h1>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" className="hover:text-primary" asChild>
             <Link href="/my-books">My Books</Link>
          </Button>
           <Button variant="ghost" className="hover:text-primary" asChild>
             <Link href="/devotionals">Devotionals</Link>
          </Button>
           <Button variant="ghost" className="hover:text-primary" asChild>
             <Link href="/volunteer">Volunteer</Link>
          </Button>
           <Button className="text-primary-foreground bg-primary hover:bg-primary/90" asChild>
             <Link href="/login">Login</Link>
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

    