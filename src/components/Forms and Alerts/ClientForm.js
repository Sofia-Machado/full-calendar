import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AnimatePresence, motion } from 'framer-motion';

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
};


export default function ClientForm() {
    const params = useParams()
    const [openClientForm, setOpenClientForm] = useState(true);
    const handleCloseClientForm = () => {
      setOpenClientForm(false)
      setTimeout(() => {
        window.open('', '_self');
        window.close();
      }, 300)
    };
    const id = parseInt(params.id, 10)
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
      <AnimatePresence>
        <Modal
          component={motion.div}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          open={openClientForm}
          key="modal"
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{textAlign: 'right'}}>
              <IconButton aria-label="close-modal" onClick={handleCloseClientForm} >
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Client: {data.data.title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Call Log:
            </Typography>
          </Box>
        </Modal>
      </AnimatePresence>
    );
}