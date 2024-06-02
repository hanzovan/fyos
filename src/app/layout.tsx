import type { Metadata } from "next";
import "./globals.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { MainNavbar } from "@/components/ui/organisms/MainNavbar";
import { NextAuthSessionProvider } from "@/components/providers";
import { ScrollToTop } from "@/components/ui/organisms";


export const metadata: Metadata = {
  title: "Find Your Own Shine",
  description: "By Hanzovan",
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
            <ScrollToTop>
              {children}
            </ScrollToTop>
          </main>
        </body>
      </NextAuthSessionProvider>
    </html>
  );
}
