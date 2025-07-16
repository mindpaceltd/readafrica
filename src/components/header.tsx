import { BookHeart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MobileNavTrigger } from "./mobile-nav";

export function Header() {
  return (
    <header className="bg-primary shadow-lg sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 group">
          <BookHeart className="text-primary-foreground h-7 w-7 md:h-8 md:w-8 group-hover:text-accent transition-colors" />
          <h1 className="text-2xl md:text-3xl font-headline text-primary-foreground group-hover:text-accent transition-colors">
            Prophetic Reads
          </h1>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground" asChild>
             <Link href="/my-books">My Books</Link>
          </Button>
           <Button variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground" asChild>
             <Link href="/devotionals">Devotionals</Link>
          </Button>
           <Button variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground" asChild>
             <Link href="/volunteer">Volunteer</Link>
          </Button>
           <Button className="text-primary-foreground bg-accent hover:bg-accent/80" asChild>
             <Link href="/login">Login</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <MobileNavTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
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
