import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button, Box } from '@mui/material';

const QrScanner = (props) => {
  const [data, setData] = useState('');
  const [facingMode, setFacingMode] = useState('user');

  useEffect(() => {
    console.info(data);
    props.passData(data);
  }, [data]);

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <QrReader
        key={facingMode}
        onResult={(result, error) => {
          if (result) {
            setData(result?.text);
          }
        }}
        constraints={{ facingMode: facingMode }}
        style={{ width: '100%' }}
      />
      <Button
        size="small"
        variant="outlined"
        onClick={toggleCamera}
        sx={{ mt: 1, fontSize: '0.75rem' }}
      >
        Switch Camera ({facingMode === 'user' ? 'Rear' : 'Front'})
      </Button>
    </Box>
  );
};

export default QrScanner;