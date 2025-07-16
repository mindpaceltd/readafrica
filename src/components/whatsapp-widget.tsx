// src/components/whatsapp-widget.tsx
'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// WhatsApp SVG Icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 32 32" {...props}>
        <path
        d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.044-.53-.044-.302 0-.53.09-.665.25-.273.318-.42.76-.42 1.22 0 .826.62 1.92 1.21 2.562.172.186.356.375.54.57.75.656 1.626 1.29 2.625 1.636.857.275 1.54.266 1.998.09.438-.162 1.135-.645 1.33-1.26.202-.615.202-1.16.14-1.28-.058-.12-.31-.19-.64-.19zm-8.231 8.905a10.386 10.386 0 0 0 5.574-1.615L20 25.5l-1.615-3.572a10.372 10.372 0 0 0 1.574-5.573 10.373 10.373 0 0 0-10.373-10.374A10.373 10.373 0 0 0 1.23 16.33a10.373 10.373 0 0 0 10.373 10.373z"
        fill="currentColor"
        />
    </svg>
);


export function WhatsAppWidget() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // In an embedded app context, the widget is generally not needed.
  // We can also control visibility based on the route.
  const isVisible = false; // !pathname.startsWith('/admin') && !pathname.startsWith('/login');

  if (!isMounted || !isVisible) {
    return null;
  }

  // NOTE: Replace this with your actual phone number including the country code (without '+')
  const whatsappNumber = "1234567890";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <Link 
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center justify-center w-14 h-14 rounded-full",
        "bg-green-500 text-white shadow-lg",
        "transition-transform duration-300 ease-in-out hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      )}
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-8 h-8"/>
    </Link>
  );
}

