import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

const icons = {
  success: <Check size={16} color="#35C98A" />,
  error: <X size={16} color="#E05A6D" />,
  info: <Info size={16} color="#8B72FF" />,
  warning: <AlertTriangle size={16} color="#E9B949" />,
};

export const Toast = ({ open, type = 'info', message, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [open, message, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}
        >
          <Box
            onClick={onClose}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: '#101016',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '10px',
              px: 2,
              py: 1.5,
              cursor: 'pointer',
              maxWidth: 360,
            }}
          >
            {icons[type] || icons.info}
            <Typography sx={{ color: '#F2F0F8', fontSize: '14px' }}>{message}</Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
