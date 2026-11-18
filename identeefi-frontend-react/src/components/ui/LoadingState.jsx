import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

export const LoadingState = ({ label = 'LOADING', compact = false }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      py: compact ? 2 : 6,
      bgcolor: compact ? 'transparent' : '#101016',
      border: compact ? 'none' : '1px solid rgba(255,255,255,0.10)',
      borderRadius: compact ? 0 : '16px',
    }}
  >
    <CircularProgress size={18} sx={{ color: '#6D4AFF' }} />
    <Typography sx={{ color: '#A5A1B2', fontSize: '13px', fontWeight: 600, letterSpacing: '1px' }}>
      {label}
    </Typography>
  </Box>
);

export const EmptyState = ({ title, description }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 6,
      px: 4,
      bgcolor: '#101016',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '16px',
    }}
  >
    <Typography sx={{ color: '#F2F0F8', fontSize: '18px', fontWeight: 600, mb: 1 }}>{title}</Typography>
    {description && <Typography sx={{ color: '#A5A1B2', fontSize: '14px' }}>{description}</Typography>}
  </Box>
);

export default LoadingState;
