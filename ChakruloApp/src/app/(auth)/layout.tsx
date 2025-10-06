import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <main className="layout auth-layout w-full h-screen flex flex-col items-center justify-center">
        {children}
      </main>
    </ClerkProvider>
  );
}
