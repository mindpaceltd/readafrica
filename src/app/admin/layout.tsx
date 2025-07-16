// src/app/admin/layout.tsx
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <AdminSidebar />
      <div className="md:ml-64 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
