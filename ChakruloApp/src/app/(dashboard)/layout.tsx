import { type ReactNode } from "react";
import DashboardNavBar from "@/components/ui/DashboardNavBar";
import { ClerkProvider } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <DashboardNavBar />
      <main className="w-full h-screen overflow-hidden">
        {children}
      </main>
    </ClerkProvider>
  );
}
