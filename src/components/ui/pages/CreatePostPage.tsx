"use client";

import { PostZodSchema } from "@/database/schema";
import { PostRequest } from "@/lib/requests";
import { validateZodInput } from "@/lib/validators";
import { SiteSessionProps } from "@/types";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const photos = [
  "/post1.jpg",
  "/post2.jpg",
  "/post3.jpg",
  "/post4.jpg",
  "/post5.jpg",
  "/post6.jpg",
  "/post7.jpg",
  "/post8.jpg",
  "/post9.jpg",
  "/post10.jpg",
];

const getPhoto = () => {
  const randomNumber = Math.round(Math.random() * (photos.length - 1));
  return photos[randomNumber];
};

// set the initial state
const initialState = {
  body: {
    title: "",
    description: "",
    content: "",
  },
  message: "",
  isLoading: false,
};
const CreatePostPage: React.FC<SiteSessionProps> = ({ session }) => {
  // initial state
  const [state, setState] = useState(initialState);
  const router = useRouter();

  // everytime the title, description, or content change, change the state value accordingly
  // the other part unchanged
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setState((prev) => ({
      ...prev,
      message: "",
      body: {
        ...prev.body,
        [event.target.name]: event.target.value,
      },
    }));
  };

  // when user submit, add a random photo to the state, parse the load to validate
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    try {
      const photo = getPhoto();
      const parsedResult = validateZodInput(
        { ...state.body, photo },
        PostZodSchema
      );

      // if validation get error, parse the error message to state
      if (parsedResult.isError) {
        return setState((prev) => ({
          ...prev,
          message: parsedResult.message,
        }));
      }
      // if validation success, start to process, loading become true
      setState((prev) => ({ ...prev, isLoading: true }));

      // send request
      const result = await PostRequest.createNewPost(
        parsedResult.data,
        session?.accessToken
      );
      
      if (!result.isError) {
        setState(() => ({
          ...initialState,
          isLoading: false,
          message: result.message,
        }));
        // get post id, then redirect user to that post
        const slug = result?.data?.slug;
        router.push(`/articles/${slug}`);
      }
      setState((prev) => ({
        ...prev,
        isLoading: false,
        message: result.message,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  };
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
            Create New Post
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
                      value={state.body.title}
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box sx={{ my: 3 }}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Post Description"
                      value={state.body.description}
                      onChange={handleInputChange}
                    />
                  </Box>
                  <Box sx={{ my: 3 }}>
                    <TextField
                      fullWidth
                      id="content"
                      name="content"
                      label="Post Content"
                      value={state.body.content}
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
                      onClick={(ev) => handleSubmit(ev)}
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
                      Submit
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

export { CreatePostPage };