// src/app/publisher/layout.tsx
import { PublisherSidebar } from "@/components/publisher-sidebar";

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
        <div className="max-w-7xl mx-auto">
            <PublisherSidebar />
            <div className="md:ml-64 p-4 md:p-8">
                {children}
            </div>
        </div>
    </div>
  );
}
