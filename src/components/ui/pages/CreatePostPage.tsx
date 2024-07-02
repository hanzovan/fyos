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
import { useEffect, useState } from "react";

// import for editor
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  MuiContentEditable,
  placeHolderSx,
} from "../organisms/LexicalEditor/styles";
import { ToolbarPlugin, TreeViewPlugin } from "../organisms/LexicalEditor/plugins";
import YouTubePlugin from "../organisms/LexicalEditor/plugins/YouTubePlugin";
import MyNodes from "../organisms/LexicalEditor/nodes/MyNodes";
import AutoEmbedPlugin from "../organisms/LexicalEditor/plugins/AutoEmbedPlugin";

const theme = {
  code: "editor-code",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  image: "editor-image",
  link: "editor-link",
  list: {
    listitem: "editor-listitem",
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
  },
  ltr: "ltr",
  paragraph: "editor-paragraph",
  placeholder: "editor-placeholder",
  quote: "editor-quote",
  rtl: "rtl",
  text: {
    bold: "editor-text-bold",
    code: "editor-text-code",
    hashtag: "editor-text-hashtag",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    strikethrough: "editor-text-strikethrough",
    underline: "editor-text-underline",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
  },
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

function MyOnChangePlugin({ onChange }: { onChange: any }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

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

  // Lexical editor config
  const editorConfig = {
    namespace: "MyEditor",
    nodes: [...MyNodes],
    theme: theme,
    onError,
  };

  const [editorState, setEditorState] = useState<string | undefined>();

  function editorOnChange(editorState: any) {
    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));

    setState((prev) => ({
      ...prev,
      body: {
        ...prev.body,
        content: JSON.stringify(editorStateJSON),
      },
    }));
  }

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
              color: "white",
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
                    <LexicalComposer initialConfig={editorConfig}>
                      <Box
                        sx={{
                          my: 3,
                          borderRadius: 2,
                          color: "black",
                          position: "relative",
                          lineHeight: 20,
                          fontWeight: 400,
                          textAlign: "left",
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                        }}
                      >
                        <ToolbarPlugin />
                        <Box
                          sx={{
                            position: "relative",
                            background: "white",
                            mt: 1,
                          }}
                        >
                          <RichTextPlugin
                            contentEditable={<MuiContentEditable />}
                            placeholder={
                              <Box sx={placeHolderSx}>Post Content</Box>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                          />
                          <HistoryPlugin />
                          <YouTubePlugin />
                          <AutoFocusPlugin />
                          <AutoEmbedPlugin />
                          {/* <TreeViewPlugin /> */}
                          <MyOnChangePlugin onChange={editorOnChange} />
                        </Box>
                      </Box>
                    </LexicalComposer>
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
