"use client";

import { HeaderVideo } from "@/components/ui/organisms";
import { ArticlePage } from "@/components/ui/pages";
import { PostRequest } from "@/lib/requests";
import { getErrorMessage } from "@/lib/utils";
import { Box, CircularProgress, Typography } from "@mui/material";
import { NextPage } from "next";
import useSWR from "swr";

const Page: NextPage = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useSWR("/posts", PostRequest.getAllNodePublicPosts);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">{getErrorMessage(error)}</Typography>
      </Box>
    );
  }

  return (
    <>
      <HeaderVideo url='/sunset.mp4' title="Find Your Own Shine" description="Where Every Interest Finds Its Light" />
      <Box sx={{ padding: 4 }}>
        <ArticlePage posts={posts} title="Articles" />
      </Box>
    </>
  );
};

export default Page;
