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
                        textAlign: "center",
                        fontSize: {lg: "3rem", md: 20, sm: 20, xs: 20},
                        py: 2,
                        pt: 8
                    }}
                    variant="h3"
                >
                    {title}
                </Typography>
                <Grid container spacing={2}>
                    {posts.map(post => (
                        <Grid item key={post.title} lg={4}>
                            <PostCard post={post} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    )
}

export { ArticlePage };