"use client";

import { formatDate } from "@/lib/utils";
import { IPost } from "@/types";
import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { HeaderImage } from "./HeaderImage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SingleArticleProps {
  post: IPost;
}

const ArticleCard: React.FC<SingleArticleProps> = ({ post }) => {
  // Check if user is the author of the post or not
  const { data: session } = useSession();
  const isAuthor = session?.user?.email === post.user.email;
  const isAdmin = session?.user?.role === "admin";

  // if author click edit, redirect them to the editing page
  const router = useRouter();
  const handleEdit = () => {
    router.push(`${post.slug}/edit`);
  };
  return (
    <Box>
      <HeaderImage
        photo={post.photo}
        title={post.title}
        description={post.description}
      />
      <Paper
        sx={{
          pt: "4rem",
          pb: "2rem",
          px: "2rem",
          backgroundColor: "inherit",
          color: (theme) => theme.palette.common.white,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            marginBottom: 2,
            fontSize: {
              lg: "1.3rem",
              md: "1.2rem",
              sm: "1.2rem",
              xs: "1.2rem",
            },
            lineHeight: 1.6,
            maxWidth: "40rem",
            mx: "auto",
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
          {/* if user is author or admin allow them to edit */}
          {(isAuthor || isAdmin) && (
            <Box>
              <Button variant="contained" onClick={handleEdit}>
                Edit Article
              </Button>
            </Box>
          )}
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
