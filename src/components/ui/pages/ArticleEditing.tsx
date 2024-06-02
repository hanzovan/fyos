"use client";

import { PostRequest } from "@/lib/requests";
import { Box, Button, CircularProgress, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ArticleEditingProps {
  session: Session;
  articleSlug: string;
}

const ArticleEditing: React.FC<ArticleEditingProps> = ({
  session,
  articleSlug,
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
    isLoading: true, // interacting was disable until original post was fetched and display
  };
  const [state, setState] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    if (articleSlug) {
      PostRequest.getSinglePublicPost(articleSlug as string).then((data) => {
        setState((prev) => ({
          ...prev,
          article: data,
          isLoading: false, // after fetched the body, allow user to interact
        }));
      });
    }
  }, [articleSlug]);

  if (state.isLoading) {
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
  if (!state.article) {
    return <Typography>No article found</Typography>;
  }
  const isAuthor = session?.user?.id === state.article.user.id;
  const isAdmin = session?.user?.role === "admin";

  if (!isAuthor && !isAdmin) {
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
    // start process by disable interaction
    setState(prev => ({ ...prev, isLoading: true }))
    try {
        const result = await PostRequest.updatePost(articleSlug as string, {
            title: state.article.title,
            description: state.article.description,
            content: state.article.content
        }, session.accessToken);
        if (result.isError) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                message: result.message
            }))
        } else {
            const newSlug = result.data.data.slug;
            setState(prev => ({
              ...initialState,
              isLoading: false,
              message: result.message
            }));
            setTimeout(() => {
              router.push(`/articles/${newSlug}`);
            }, 100);
        }
    } catch (error) {
        setState(prev => ({
            ...prev,
            isLoading: false,
            message: error instanceof Error ? error.message: "An unknown error occurred"
        }))
    }
  }

  const handleDelete = async () => {
    // confirm before deleting
    const confirmDelete = window.confirm("This action cannot be undone! Are you really want to delete this article?")
    if (!confirmDelete) {
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const result = await PostRequest.deletePost(articleSlug as string, session.accessToken);
      if (result.isError) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          message: result.message
        }))
      } else {
        setState(prev => ({
          ...initialState,
          isLoading: false,
          message: result.message
        }))
        setTimeout(() => {
          router.push("/");
        }, 100); // add a small delay
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        message: error instanceof Error ? error.message : "An unknown error occurred"
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
                  <Box sx={{ textAlign: "center", my: 3, display: "flex", justifyContent: "center" }}>
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
                    <Button
                      disabled={state.isLoading}
                      onClick={handleDelete}
                      variant="contained"
                      color="error"
                      sx={{ width: 200, borderRadius: 30, marginLeft: 10 }}
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
                      Delete Article
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
