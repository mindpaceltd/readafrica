// src/app/my-books/layout.tsx
import { UserSidebar } from "@/components/user-sidebar";

export default function MyBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
        <div className="max-w-5xl mx-auto">
            <UserSidebar />
            <div className="md:ml-64 p-4 md:p-8">
                {children}
            </div>
      </div>
    </div>
  );
}
