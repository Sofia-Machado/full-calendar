import { Button, Popover, Typography } from '@mui/material';
import { useState } from 'react';

export default function Alert({ openAlert, setOpenAlert }) {

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
      <Popover
        open={openAlert}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
  );
}