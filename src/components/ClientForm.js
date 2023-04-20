import { Box, Button, Modal, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ClientForm({ openClientForm, setOpenClientForm, eventInfo, handleOpenClientForm }) {
  
  const handleCloseClientForm = () => setOpenClientForm(false);

  return (
    <div>
      <Modal
        open={openClientForm}
        onClose={handleCloseClientForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Client: {eventInfo.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            call Log:
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}