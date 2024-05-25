"use client";

import { PostRequest } from "@/lib/requests";
import { CustomSession, SiteSessionProps } from "@/types";
import { Box, Button, CircularProgress, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ArticleEditingProps {
  session: CustomSession;
  articleId: string;
}

const ArticleEditing: React.FC<ArticleEditingProps> = ({
  session,
  articleId,
}) => {

  const initialState = {
    article: {
      title: "",
      description: "",
      content: "",
      user: {
        id: "",
      },
    },
    message: "",
    isLoading: true,
  };
  const [state, setState] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    if (articleId) {
      PostRequest.getSinglePublicPost(articleId as string).then((data) => {
        setState((prev) => ({
          ...prev,
          article: data,
          isLoading: false,
        }));
      });
    }
  }, [articleId]);

  if (state.isLoading) {
    return <CircularProgress />;
  }
  if (!state.article) {
    return <Typography>No article found</Typography>;
  }
  const isAuthor = session?.user?.id === state.article.user.id;

  if (!isAuthor) {
    return redirect("/");
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState(prev => ({
        ...prev,
        message: "",
        article: {
            ...prev.article,
            [event.target.name]: event.target.value
        }
    }))
  }
  const handleSave = async () => {
    try {
        const result = await PostRequest.updatePost(articleId as string, {
            title: state.article.title,
            description: state.article.description,
            content: state.article.content
        }, session.accessToken);
        if (result.isError) {
            setState(prev => ({
                ...prev,
                message: result.message
            }))
        } else {
            router.push(`/articles/${articleId}`);
        }
    } catch (error) {
        setState(prev => ({
            ...prev,
            message: error instanceof Error ? error.message: "An unknown error occurred"
        }))
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mx: 2, pt: 8, mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontSize: { lg: "3.75rem", md: 20, sm: 20, xs: 20 },
              py: 2,
              color: "white"
            }}
          >
            Edit Post
          </Typography>
          <Grid container spacing={2}>
            <Grid item lg={8} md={12} sm={12} xs={12} sx={{ margin: "0 auto" }}>
              <Paper sx={{ p: 3 }}>
                <Box>
                  <Box sx={{ my: 3 }}>
                    <TextField
                      fullWidth
                      id="title"
                      name="title"
                      label="Post title"
                      value={state.article.title}
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box sx={{ my: 3 }}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Post Description"
                      value={state.article.description}
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box sx={{ my: 3 }}>
                    <TextField
                      fullWidth
                      id="content"
                      name="content"
                      label="Post Content"
                      value={state.article.content}
                      onChange={handleInputChange}
                      multiline
                      minRows={10}
                      maxRows={12}
                    />
                  </Box>
                  <Box sx={{ my: 3 }}>
                    <Typography color="error" sx={{ whiteSpace: "pre-wrap" }}>
                      {state.message && state.message}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", my: 3 }}>
                    <Button
                      disabled={state.isLoading}
                      onClick={handleSave}
                      variant="contained"
                      sx={{ width: 200, borderRadius: 30 }}
                      startIcon={
                        state.isLoading && (
                          <CircularProgress
                            size={20}
                            sx={{
                              color: (theme) => theme.palette.common.white,
                            }}
                          />
                        )
                      }
                    >
                      Save Change
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>   
  );
};

export { ArticleEditing };
