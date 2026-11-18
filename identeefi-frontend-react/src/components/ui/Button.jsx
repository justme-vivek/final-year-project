import React from 'react';
import { Button as MuiButton } from '@mui/material';

export const PrimaryButton = ({ children, ...props }) => (
  <MuiButton
    variant="contained"
    color="primary"
    {...props}
    sx={{
      bgcolor: '#6D4AFF',
      border: '1px solid #6D4AFF',
      borderRadius: '10px',
      px: 3.5,
      py: 1.4,
      fontWeight: 600,
      textTransform: 'none',
      boxShadow: 'none',
      '&:hover': { bgcolor: '#4F23F8', borderColor: '#4F23F8', transform: 'translateY(-1px)', boxShadow: 'none' },
      ...(props.sx || {}),
    }}
  >
    {children}
  </MuiButton>
);

export const SecondaryButton = ({ children, ...props }) => (
  <MuiButton
    variant="outlined"
    {...props}
    sx={{
      borderColor: 'rgba(255,255,255,0.10)',
      color: '#F2F0F8',
      borderRadius: '10px',
      px: 3.5,
      py: 1.4,
      fontWeight: 600,
      textTransform: 'none',
      '&:hover': { borderColor: 'rgba(109,74,255,0.45)', bgcolor: 'rgba(255,255,255,0.03)', transform: 'translateY(-1px)' },
      ...(props.sx || {}),
    }}
  >
    {children}
  </MuiButton>
);

export default PrimaryButton;
