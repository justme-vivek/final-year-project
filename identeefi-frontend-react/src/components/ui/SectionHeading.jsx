import React from 'react';
import { Box, Typography } from '@mui/material';

export const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => (
  <Box sx={{ textAlign: align, mb: 6, maxWidth: align === 'center' ? 680 : '100%', mx: align === 'center' ? 'auto' : 0 }}>
    {eyebrow && (
      <Typography sx={{ color: '#6D4AFF', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', mb: 2 }}>
        {eyebrow}
      </Typography>
    )}
    <Typography sx={{ color: '#F2F0F8', fontSize: { xs: '28px', md: '36px' }, fontWeight: 600, lineHeight: 1.2, mb: 2 }}>
      {title}
    </Typography>
    {description && (
      <Typography sx={{ color: '#A5A1B2', fontSize: '16px', lineHeight: 1.6 }}>{description}</Typography>
    )}
  </Box>
);

export default SectionHeading;
