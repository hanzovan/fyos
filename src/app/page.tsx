"use client";

import { ArticlePage } from "@/components/ui/pages";
import { PostRequest } from "@/lib/requests";
import { getErrorMessage } from "@/lib/utils";
import { Box, CircularProgress, Typography } from "@mui/material";
import { NextPage } from "next";
import Image from "next/image";
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
      <Box sx={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
        <video
          autoPlay
          muted
          loop
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "cover", // ensure the video was crop to fit if browser width was reduced
            zIndex: 1,
            transform: "translate(-50%, -50%)",
          }}
        >
          <source src="/sunset.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "row"
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Play Fair",
              color: (theme) => theme.palette.common.white,
              p: 4,
              fontSize: { lg: "3.75rem", md: "3rem", sm: "2.5rem", xs: "2rem" },
              mt: "35vh",
              textAlign: "center"
            }}
          >
            Find Your Own Shine
          </Typography>
        </Box>
      </Box>
      <Box sx={{ padding: 4 }}>
        <ArticlePage posts={posts} title="Articles" />
      </Box>
    </>
  );
};

export default Page;
