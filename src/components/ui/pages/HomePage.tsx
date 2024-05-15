"use client";
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const HomePage = () => {
    return (
        <Box sx={{
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh'
        }}>
            <Box sx={{
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}>
                <Box sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh'
                }}>
                    <Image 
                        src={'/logo-sm.png'}
                        alt='logo'
                        width={270}
                        height={298}
                    />
                    <Typography 
                        variant='h2' 
                        sx={{
                            fontFamily: 'Play Fair',
                            color: theme => theme.palette.common.white,
                            p: 4,
                            fontSize: {lg: '3.75rem', md: 20, sm: 20, xs: 20}
                        }}
                    >
                        Find Your Own Shine
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export { HomePage };