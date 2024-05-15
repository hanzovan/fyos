"use client";
import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface NextAuthSessionProviderProps {
    children: ReactNode
}

export const NextAuthSessionProvider: FC<NextAuthSessionProviderProps> = ({children}) => {
    return (
        <SessionProvider refetchOnWindowFocus refetchInterval={5 * 60}>
            {children}
        </SessionProvider>
    )
}