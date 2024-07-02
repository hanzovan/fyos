import styled from "@emotion/styled";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { Box } from "@mui/material";
import { Theme } from "@mui/material/styles"; // Import the Theme type

const MuiContentEditable = styled(ContentEditable)({
  minHeight: 200,
  width: "100%",
  padding: "16.5px 14px", // Match MUI TextField padding
  borderRadius: 4,
  border: "1px solid #ccc", // We'll set the border color in a separate rule
  position: "relative",
  outline: "none",
  fontSize: "1rem", // Match MUI TextField font size
  lineHeight: 1.4375,
  "&:focus": {
    borderColor: "none",
    boxShadow: "0 0 0 2px rgba(0, 0, 255, 0.5)", // Using primary.main color
  },
});


const MuiContentReadOnly = styled(ContentEditable)({
    position: "relative",
    outline: "none",
    fontSize: "1.2rem", // Match MUI TextField font size
    lineHeight: 1.6,
    color: "white"
  });


const placeHolderSx = {
  position: "absolute",
  top: "16.5px", // Match padding-top
  left: "14px", // Match padding-left
  userSelect: "none",
  display: "inline-block",
  pointerEvents: "none",
  fontSize: "1rem",
  lineHeight: 1.4375,
  color: "rgba(0, 0, 0, 0.54)", // Match MUI TextField placeholder color
};

export { MuiContentEditable, placeHolderSx, MuiContentReadOnly};
