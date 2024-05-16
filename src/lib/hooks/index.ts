import { CustomSession } from "@/types";
import { useSession } from "next-auth/react"

export const useAuthUser = (url = "/") => {
    const { data: sessionData, status } = useSession();
    const session = sessionData as CustomSession | null;
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";

    return { session, isLoading, isAuthenticated }
}