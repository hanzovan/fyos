"use client";

import { formatDate } from "@/lib/utils";
import { IPost } from "@/types";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";

interface SingleArticleProps {
  post: IPost;
}

const ArticleCard: React.FC<SingleArticleProps> = ({ post }) => {
  
  return (
    <Box>
      <Paper sx={{ position: 'relative', height: '100vh', width: '100%' }}>
        <Box sx={{ position: 'relative', height: '100%' }}>
          <Image
            alt="post photo"
            src={post.photo}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            style={{ filter: 'brightness(0.5)' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
              zIndex: 1,
            }}
          >
            <Typography variant="h3" sx={{ marginBottom: 2, fontSize: { xs: '2rem', sm: '3rem' } }}>
              {post.title}
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: 2, fontSize: { xs: '1rem', sm: '1.5rem' } }}>
              {post.description}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper>
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

export { ArticleCard };
