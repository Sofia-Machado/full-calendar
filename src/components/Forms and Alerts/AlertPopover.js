import { Popover, Alert } from '@mui/material';

export default function AlertPopover({ openAlert, setOpenAlert }) {

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
        <Alert variant="filled" severity="error" >Impossible d'insérer un événement avant l'heure actuelle</Alert>
      </Popover>
  );
}