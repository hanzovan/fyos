"use client";

import { ArticlePage } from "@/components/ui/pages/ArticlePage";
import { useAuthUser } from "@/lib/hooks";
import { PostRequest } from "@/lib/requests";
import { getErrorMessage } from "@/lib/utils";
import { Box, CircularProgress, Typography } from "@mui/material";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import useSWR from "swr";

const Page: NextPage = () => {
    const {
        session,
        isLoading: isSessionLoading, // rename isLoading from useAuthUser to isSessionLoading, avoiding duplication
        isAuthenticated
    } = useAuthUser();

    const {
        data: posts,
        isLoading,
        error        
    } = useSWR(["/posts", session?.accessToken], ([url, token]) => PostRequest.getAllNodeAPIPosts(token));// if accessToken changed, refetch data, if not, use cache data

    if (isLoading || isSessionLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    // check if session and useSWR loading finish then decide redirect if user not authenticated, this improvement help unnecessary redirection
    if (!isAuthenticated && !isLoading && !isSessionLoading) {
        redirect("/api/auth/signin?callbackUrl=/blog");
    }
    if (error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh"
                }}
            >
                <Typography variant="h6">{getErrorMessage(error)}</Typography>
            </Box>
        )
    }
    return (
        <ArticlePage posts={posts} title="Client Site Post fetching from node server" />
    )
}

export default Page;