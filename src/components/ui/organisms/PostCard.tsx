"use client";

import { formatDate } from "@/lib/utils";
import { IPost } from "@/types";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Box
      component={Link}
      href={`/articles/${post.slug}`}
      passHref
      sx={{ height: "100%", position: "relative", overflow: "hidden" }}
    >
      <Paper
        sx={{
          position: "relative",
          height: "400px",
          overflow: "hidden",
          "&:hover .contentOverlay": {
            transform: "translateY(0)",
          },
          "&:hover .description": {
            opacity: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
        >
          <Image
            src={post.photo}
            alt={post.title}
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Box
          className="contentOverlay"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 2,
            transition: "transform 0.3s ease-in-out",
            transform: `translateY(40%)`,
            pt: "2.4rem",
            px: "1.5rem",
          }}
        >
          <Box
            sx={{
              cursor: "pointer",
              mb: "auto",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: {
                  lg: "1.8rem",
                  md: "1.8rem",
                  xs: "1.6rem"
                },
                mb: "1rem"
              }}
            >
              {post.title}
            </Typography>

            <Typography
              variant="body2"
              className="description"
              sx={{
                mb: 1,
                fontSize: "1.1rem",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              {post.description}
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="body2"
                sx={{
                  wordWrap: "break-word",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                Posted on: {formatDate(post.createdAt)}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{ height: 24, width: 24, mr: 1 }}
                src={post?.user?.avatar}
                alt={post?.user?.name}
              />

              <Typography
                variant="body2"
                sx={{
                  wordWrap: "break-word",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                {post?.user?.name}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export { PostCard };
