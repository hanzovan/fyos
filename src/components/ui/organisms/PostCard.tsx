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
        <Box sx={{ height: "100%" }}>
            <Paper sx={{ height: "100%" }}>
                <Box
                    component={Link}
                    href={`/blog${post.slug}`}
                    passHref
                    sx={{ cursor: "pointer" }}
                >
                    <Image
                        alt="post photo"
                        src={post.photo}
                        height={320}
                        width={320}
                        style={{
                            objectFit: "cover",
                            objectPosition: "center",
                            width: "100%"
                        }}
                    />
                </Box>
                <Box sx={{ p: 1 }}>
                    <Typography
                        component={Link}
                        href={`/blog${post.slug}`}
                        passHref
                        sx={{
                            cursor: "pointer",
                            color: "inherit",
                            textDecoration: "none"
                        }}
                        variant="h5"
                    >
                        {post.title}
                    </Typography>
                    <Typography variant="body2">{post.description}</Typography>
                    <Stack
                        sx={{ my: 1 }}
                        direction={"row"}
                        spacing={2}
                        justifyContent={"space-between"}
                    >
                        <Box>
                            <Typography variant="body2">Posted on: </Typography>
                            <Typography suppressHydrationWarning={true} variant="body2">
                                {formatDate(post.createdAt)}{" "}
                            </Typography>
                        </Box>
                        <Box>
                            <Link href={`/blog${post.slug}`} passHref>
                                <Avatar
                                    sx={{ height: 20, width: 20 }}
                                    src={post?.user?.avatar}
                                    alt={post?.user?.name}
                                />
                            </Link>
                            <Typography variant="body2">{post?.user?.name}</Typography>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    )
}

export { PostCard };