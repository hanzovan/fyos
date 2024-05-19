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
      <Box
        sx={{
          backgroundImage: "url(/bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <Image src={"/logo-sm.png"} alt="logo" width={270} height={298} />
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Play Fair",
                color: (theme) => theme.palette.common.white,
                p: 4,
                fontSize: { lg: "3.75rem", md: 20, sm: 20, xs: 20 },
              }}
            >
              Find Your Own Shine
            </Typography>
          </Box>
        </Box>
      </Box>
      <ArticlePage
        posts={posts}
        title="Articles"
      />
    </>
  );
};

export default Page;
