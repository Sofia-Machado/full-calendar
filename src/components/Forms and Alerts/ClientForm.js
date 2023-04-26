import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Box, Modal, Typography } from '@mui/material';

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
  borderRadius: 5, 
  onFocusVisible: { border: 'none' }
};


export default function ClientForm() {
    const params = useParams()
    const [openClientForm, setOpenClientForm] = useState(true);
    const handleCloseClientForm = () => setOpenClientForm(false);
    const id = parseInt(params.id, 10)
    console.log(id)
    const fetchEvents = () => {
        return axios.get(`http://localhost:8080/events/${id}`)
    }  
    const onSuccess = (response) => {
        console.log('success');
      }
      const onError = () => {
        console.log('error')
      }
    const { isLoading, data, isError, error } = useQuery('event', fetchEvents,
    {
      onSuccess,
      onError
    })

    if (isLoading) {
        return <h2>Loading...</h2>
      }
      if (isError) {
        return <h2>{error.message}</h2>
      }
    
    return (
        <Modal
            open={openClientForm}
            onClose={handleCloseClientForm}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Client: {data.data.title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                call Log:
            </Typography>
            </Box>
        </Modal>
    );
}