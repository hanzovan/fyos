"use client";

import { PostRequest } from "@/lib/requests";
import { isValidJson } from "@/lib/utils";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
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
import { Session } from "next-auth";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MyNodes from "../organisms/LexicalEditor/nodes/MyNodes";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  MyOnChangePlugin,
  ToolbarPlugin,
} from "../organisms/LexicalEditor/plugins";
import {
  MuiContentEditable,
  MuiContentReadOnly,
  placeHolderSx,
} from "../organisms/LexicalEditor/styles";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import YouTubePlugin from "../organisms/LexicalEditor/plugins/YouTubePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import AutoEmbedPlugin from "../organisms/LexicalEditor/plugins/AutoEmbedPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

// Lexical theme
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

// set Lexical Plugin for editing
function MyEditingPlugin({
  savedEditorStateRef,
}: {
  savedEditorStateRef: string;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (savedEditorStateRef) {
      const editorStateJSON = JSON.parse(savedEditorStateRef);
      editor.update(() => {
        const newEditorState = editor.parseEditorState(editorStateJSON);
        editor.setEditorState(newEditorState);
      });
      // editor.setEditable(false);
    }
  }, [editor]);
  return null;
}

// function MyPlugin({ savedEditorStateRef }: { savedEditorStateRef: string }) {
//   const [editor] = useLexicalComposerContext();
//   useEffect(() => {
//     if (savedEditorStateRef) {
//       const editorStateJSON = JSON.parse(savedEditorStateRef);
//       editor.update(() => {
//         const newEditorState = editor.parseEditorState(editorStateJSON);
//         editor.setEditorState(newEditorState);
//       });
//       editor.setEditable(false);
//     }
//   }, [editor]);
//   return null;
// }

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

  const [editorState, setEditorState] = useState<string | undefined>();

  // When being trigger by MyEditorOnChange, set Editorstate to current state, stringify it and set the body's content to new state
  function editorOnChange(editorState: any) {
    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));

    setState((prev) => ({
      ...prev,
      article: {
        ...prev.article,
        content: JSON.stringify(editorStateJSON),
      },
    }));
  }

  // fetch post from database using useEffect
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

  // Check if post content is valid JSON
  const isJsonContent = isValidJson(state.article.content);

  const isAuthor = session?.user?.id === state.article.user.id;
  const isAdmin = session?.user?.role === "admin";

  if (!isAuthor && !isAdmin) {
    return redirect("/");
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setState((prev) => ({
      ...prev,
      message: "",
      article: {
        ...prev.article,
        [event.target.name]: event.target.value,
      },
    }));
  };
  const handleSave = async () => {
    // start process by disable interaction
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const result = await PostRequest.updatePost(
        articleSlug as string,
        {
          title: state.article.title,
          description: state.article.description,
          content: state.article.content,
        },
        session.accessToken
      );
      if (result.isError) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          message: result.message,
        }));
      } else {
        const newSlug = result.data.data.slug;
        setState((prev) => ({
          ...initialState,
          isLoading: false,
          message: result.message,
        }));
        setTimeout(() => {
          router.push(`/articles/${newSlug}`);
        }, 100);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  };

  const handleDelete = async () => {
    // confirm before deleting
    const confirmDelete = window.confirm(
      "This action cannot be undone! Are you really want to delete this article?"
    );
    if (!confirmDelete) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const result = await PostRequest.deletePost(
        articleSlug as string,
        session.accessToken
      );
      if (result.isError) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          message: result.message,
        }));
      } else {
        setState((prev) => ({
          ...initialState,
          isLoading: false,
          message: result.message,
        }));
        setTimeout(() => {
          router.push("/");
        }, 100); // add a small delay
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
    }
  };

  const editorConfig: InitialConfigType = {
    namespace: "MyEditor",
    nodes: [...MyNodes],
    theme: theme,
    onError,
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

                  {/* render editor */}

                  {isJsonContent ? (
                    <Box sx={{ my: 3 }}>
                      <LexicalComposer initialConfig={editorConfig}>
                        <div className="editor-container">
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
                                  <Box sx={placeHolderSx}>Post content</Box>
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                              />
                              <HistoryPlugin />
                              <MyEditingPlugin
                                savedEditorStateRef={state.article.content}
                              />
                              <YouTubePlugin />
                              <AutoFocusPlugin />
                              <AutoEmbedPlugin />
                              <MyOnChangePlugin onChange={editorOnChange} />
                            </Box>
                          </Box>
                        </div>
                      </LexicalComposer>
                    </Box>
                  ) : (
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
                      {state.article.content}
                    </Typography>
                  )}

                  {/* end editor */}

                  <Box sx={{ my: 3 }}>
                    <Typography color="error" sx={{ whiteSpace: "pre-wrap" }}>
                      {state.message && state.message}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      textAlign: "center",
                      my: 3,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
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
