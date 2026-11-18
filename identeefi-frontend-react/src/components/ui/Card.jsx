import React from 'react';
import { Box } from '@mui/material';

export const Card = ({ children, hover = true, ...props }) => (
  <Box
    {...props}
    sx={{
      bgcolor: '#101016',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '16px',
      transition: 'border-color 0.2s ease',
      ...(hover ? { '&:hover': { borderColor: 'rgba(109,74,255,0.45)' } } : {}),
      ...(props.sx || {}),
    }}
  >
    {children}
  </Box>
);

export default Card;
