"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { PostRequest } from "@/lib/requests";
import { IPost } from "@/types";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getErrorMessage } from "@/lib/utils";
import { SingleArticlePage } from "@/components/ui/pages/SingleArticlePage";

interface ArticlePageProps {
    params: {
      articleSlug: string;
    };
  }

const ArticlePage: NextPage<ArticlePageProps> = ({ params }) => {

  const { articleSlug } = params;
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleSlug) {
      const fetchPost = async () => {
        try {
          const data = await PostRequest.getSinglePublicPost(articleSlug as string);
          setPost(data);
          setIsLoading(false);
        } catch (err) {
          setError(getErrorMessage(err));
          setIsLoading(false);
        }
      };

      fetchPost();
    }
  }, [articleSlug]);

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
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return post ? <SingleArticlePage post={post} /> : null;
};

export default ArticlePage;
