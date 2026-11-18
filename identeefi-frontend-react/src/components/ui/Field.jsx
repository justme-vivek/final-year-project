import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

export const Field = ({ label, error, ...props }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    {label && (
      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#A5A1B2' }}>{label}</Typography>
    )}
    <TextField
      fullWidth
      variant="outlined"
      error={Boolean(error)}
      helperText={error || ''}
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: '#15151D',
          borderRadius: '10px',
          color: '#F2F0F8',
          '& fieldset': { borderColor: error ? '#E05A6D' : 'rgba(255,255,255,0.10)' },
          '&:hover fieldset': { borderColor: error ? '#E05A6D' : 'rgba(109,74,255,0.45)' },
          '&.Mui-focused fieldset': { borderColor: error ? '#E05A6D' : '#6D4AFF' },
        },
        '& .MuiInputLabel-root': { color: '#706C7A' },
        '& .MuiFormHelperText-root': { color: '#E05A6D' },
        ...(props.sx || {}),
      }}
    />
  </Box>
);

export default Field;
