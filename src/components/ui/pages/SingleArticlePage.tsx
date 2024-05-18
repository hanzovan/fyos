"use client";

import { formatDate } from "@/lib/utils";
import { IPost } from "@/types";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";

interface SingleArticleProps {
  post: IPost;
}

const SingleArticlePage: React.FC<SingleArticleProps> = ({ post }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          {post.title}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          {post.description}
        </Typography>
        {post.photo && (
          <Box sx={{ marginBottom: 2 }}>
            <Image
              alt="post photo"
              src={post.photo}
              height={320}
              width={640}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                width: "100%"
              }}
            />
          </Box>
        )}
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          {post.content}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ marginTop: 2 }}>
          <Box>
            <Typography variant="body2">Posted on: {formatDate(post.createdAt)}</Typography>
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

export { SingleArticlePage };
