"use client";

import { formatDate } from "@/lib/utils";
import { IPost } from "@/types";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { HeaderImage } from "./HeaderImage";

interface SingleArticleProps {
  post: IPost;
}

const ArticleCard: React.FC<SingleArticleProps> = ({ post }) => {
  return (
    <Box>
      <Paper sx={{ position: "relative", height: "100vh", width: "100%" }}>
        <HeaderImage
          photo={post.photo}
          title={post.title}
          description={post.description}
        />
      </Paper>
      <Paper
        sx={{ pt: "4rem", pb: "2rem", px: "2rem", backgroundColor: "inherit", color: (theme) => theme.palette.common.white }}
      >
        <Typography
          variant="body1"
          sx={{
            marginBottom: 2,
            fontSize: {
              lg: "1.25rem",
              md: "1.125rem",
              sm: "1rem",
              xs: "0.875rem",
            },
            lineHeight: 1.6,
            mx: { lg: 30, md: 30, sm: 10, xs: 5 },
            whiteSpace: "pre-wrap", // ensure paragraph break was applied in content
          }}
        >
          {post.content}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{ marginTop: 2 }}
        >
          <Box>
            <Typography variant="body2">
              Posted on: {formatDate(post.createdAt)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{ height: 40, width: 40, marginRight: 1 }}
              src={post.user.avatar}
              alt={post.user.name}
            />
            <Typography variant="body2">{post.user.name}</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export { ArticleCard };
