"use client";

import { formatDate, isValidJson } from "@/lib/utils";
import { IPost } from "@/types";
import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { HeaderImage } from "./HeaderImage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// for lexical
import { useEffect } from "react";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MuiContentReadOnly, placeHolderSx } from "./LexicalEditor/styles";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import YouTubePlugin from "./LexicalEditor/plugins/YouTubePlugin";
import MyNodes from "./LexicalEditor/nodes/MyNodes";
import AutoEmbedPlugin from "./LexicalEditor/plugins/AutoEmbedPlugin";

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

function MyPlugin({ savedEditorStateRef }: { savedEditorStateRef: string }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (savedEditorStateRef) {
      const editorStateJSON = JSON.parse(savedEditorStateRef);
      editor.update(() => {
        const newEditorState = editor.parseEditorState(editorStateJSON);
        editor.setEditorState(newEditorState);
      });
      editor.setEditable(false);
    }
  }, [editor]);
  return null;
}

interface SingleArticleProps {
  post: IPost;
}

const ArticleCard: React.FC<SingleArticleProps> = ({ post }) => {
  // Check if user is the author of the post or not
  const { data: session } = useSession();

  const isAuthor = session?.user?.email === post.user?.email;

  const isAdmin = session?.user?.role === "admin";

  // if author click edit, redirect them to the editing page
  const router = useRouter();
  const handleEdit = () => {
    router.push(`${post.slug}/edit`);
  };

  // Check if post content is valid JSON
  const isJsonContent = isValidJson(post.content);

  const editorConfig: InitialConfigType = {
    namespace: "MyEditor",
    nodes: [...MyNodes],
    theme: theme,
    onError,
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
        {isJsonContent ? (
          <Box>
            <LexicalComposer initialConfig={editorConfig}>
              <div className="editor-container">
                <Box sx={{ position: "relative", mt: 1 }}>
                  <RichTextPlugin
                    contentEditable={<MuiContentReadOnly />}
                    placeholder={<Box sx={placeHolderSx}>Post content</Box>}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <MyPlugin savedEditorStateRef={post.content} />
                  <YouTubePlugin />
                  <AutoEmbedPlugin />
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
            {post.content}
          </Typography>
        )}

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
              src={post.user?.avatar}
              alt={post.user?.name}
            />
            <Typography variant="body2">{post.user?.name}</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export { ArticleCard };
