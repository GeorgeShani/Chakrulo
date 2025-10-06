import { ClerkProvider } from "@clerk/nextjs";
import { Outfit } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Chakrulo",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.variable}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
