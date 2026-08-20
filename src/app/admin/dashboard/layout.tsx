"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div
        className="locale-transition min-h-screen transition-all duration-300 ease-in-out lg:flex"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <AdminSidebar />
        <div className="min-h-screen flex-1 overflow-x-hidden transition-all duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </AdminGuard>
  );
}
