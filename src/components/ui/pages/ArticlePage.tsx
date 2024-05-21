"use client";

import { IPost } from "@/types";
import { Box, Container, Grid, Typography } from "@mui/material";
import { PostCard } from "../organisms";

interface ArticleProps {
    title: string;
    posts: IPost[];
}

const ArticlePage: React.FC<ArticleProps> = ({ title, posts }) => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 2 }}>
                <Typography 
                    sx={{
                        fontFamily: "Play Fair",
                        color: (theme) => theme.palette.common.white, 
                        textAlign: "center",
                        fontSize: {lg: "4rem", md: "3.75rem", sm: "3rem", xs: "2rem"},
                        py: 10,
                        pt: 5
                    }}
                    variant="h3"
                >
                    {title}
                </Typography>                

                <Grid container spacing={5}>
                    {posts.map(post => (
                        <Grid item key={post.title} lg={4} md={6} xs={12}>
                            <PostCard post={post} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

        </Container>
    )
}

export { ArticlePage };