import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface HeaderImageProps {
    photo: string;
    title: string;
    description: string;
}

const HeaderImage: React.FC<HeaderImageProps> = ({ photo, title, description }) => {
    return (
        <Box sx={{ position: "relative", height: "100%" }}>
          <Image
            alt="post photo"
            src={photo}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            style={{ filter: "brightness(0.5)" }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "white",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h3"
              sx={{ marginBottom: 2, fontSize: { xs: "2rem", sm: "3rem" } }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{ marginBottom: 2, fontSize: { xs: "1.2rem", sm: "1.8rem" } }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
    )
}

export { HeaderImage };