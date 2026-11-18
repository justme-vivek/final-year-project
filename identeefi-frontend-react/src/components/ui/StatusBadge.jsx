import React from 'react';
import { Box, Typography } from '@mui/material';

const map = {
  VERIFIED: { dot: '#35C98A', text: '#35C98A', label: 'VERIFIED' },
  AUTHENTIC: { dot: '#35C98A', text: '#35C98A', label: 'AUTHENTIC' },
  PENDING: { dot: '#E9B949', text: '#E9B949', label: 'PENDING' },
  FLAGGED: { dot: '#E05A6D', text: '#E05A6D', label: 'FLAGGED' },
  FAILED: { dot: '#E05A6D', text: '#E05A6D', label: 'FAILED' },
};

export const StatusBadge = ({ status = 'PENDING' }) => {
  const key = String(status).toUpperCase();
  const conf = map[key] || map.PENDING;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 999,
        px: 1.5,
        py: 0.5,
        bgcolor: '#15151D',
      }}
    >
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: conf.dot }} />
      <Typography sx={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: conf.text }}>
        {conf.label}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
