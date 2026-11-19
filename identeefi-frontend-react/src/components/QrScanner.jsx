import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Button, Box } from '@mui/material';

const QrScanner = (props) => {
  const [data, setData] = useState('');
  const [facingMode, setFacingMode] = useState('environment');

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
            setData((result?.text || '').trim());
          }
        }}
        constraints={{ facingMode: { ideal: facingMode } }}
        scanDelay={300}
        videoContainerStyle={{ paddingTop: '100%' }}
        style={{ width: '100%' }}
      />
      <Button
        size="small"
        variant="outlined"
        onClick={toggleCamera}
        sx={{ my: 1.5, fontSize: '0.875rem', color: '#F2F0F8', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', minHeight: 44 }}
      >
        Use {facingMode === 'environment' ? 'front' : 'rear'} camera
      </Button>
    </Box>
  );
};

export default QrScanner;