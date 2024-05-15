import type { Metadata } from "next";
import "./globals.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { MainNavbar } from "@/components/ui/organisms/MainNavbar";
import { NextAuthSessionProvider } from "@/components/providers";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NextAuthSessionProvider>
        <body lang="en">
          <MainNavbar />
          <main>
            {children}
          </main>
        </body>
      </NextAuthSessionProvider>
    </html>
  );
}
