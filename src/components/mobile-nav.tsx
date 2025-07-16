
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
import { BookHeart, Info, Mail } from 'lucide-react';

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

  return (
    <SheetContent side="left" className="w-3/4 bg-primary text-primary-foreground">
      <SheetHeader>
        <SheetTitle>
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <BookHeart className="h-7 w-7 group-hover:text-accent transition-colors" />
            <span className="text-2xl font-headline group-hover:text-accent transition-colors">
              Prophetic Reads
            </span>
          </Link>
        </SheetTitle>
      </SheetHeader>
      <nav className="flex flex-col space-y-4 mt-8">
        <Button variant="ghost" className="justify-start gap-3" asChild>
          <Link href="#about" onClick={() => setOpen(false)}>
            <Info />
            About
          </Link>
        </Button>
        <Button variant="ghost" className="justify-start gap-3" asChild>
          <Link href="#contact" onClick={() => setOpen(false)}>
            <Mail />
            Contact
          </Link>
        </Button>
      </nav>
    </SheetContent>
  );
}
