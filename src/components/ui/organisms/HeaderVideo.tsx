import { Box, Typography } from "@mui/material";
import React from "react";

interface HeaderVideoProps {
  url: string;
  title: string;
  description: string;
}

const HeaderVideo: React.FC<HeaderVideoProps> = ({
  url,
  title,
  description,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        muted
        loop
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "cover", // ensure the video was crop to fit if browser width was reduced
          zIndex: 1,
          transform: "translate(-50%, -50%)",
        }}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Play Fair",
            color: (theme) => theme.palette.common.white,
            p: 4,
            fontSize: { lg: "3.75rem", md: "3rem", sm: "2.5rem", xs: "2rem" },
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Play Fair",
            color: (theme) => theme.palette.common.white,
            p: 4,
            fontSize: { lg: "2.2rem", md: "2rem", sm: "1.8rem", xs: "1.5rem" },
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export { HeaderVideo };
