import { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import  { dataCategories } from '../data/eventData';

const CreateEventForm = ({openCreateForm, setOpenCreateForm}) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };
      
    const handleCloseCreateForm = () => {
        setOpenCreateForm(false);
    };
        
    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };

    return ( 
        <Modal
        open={openCreateForm}
        onClose={handleCloseCreateForm}
        aria-labelledby="create-event-form"
        aria-describedby="form-to-add-event-to-calendar"
        >
        <Box component='form' 
        autoComplete="off"
        sx={{ ...style, width: 400 }}
        >
            <h2 id="create-event-title">CreateEvent</h2>
            <TextField
                required
                id="create-event-title"
                label="Insert Event"
                placeholder="Insert event"
                variant="standard"
            />
            
            <FormControl variant="standard" sx={{ display: 'grid', mt: 1, maxWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
            <Select
                required
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Choose category"
                placeholder='Choose category'
                onChange={handleChangeCategory}
            >
                {dataCategories.map(category => {
                    return <MenuItem value={category}>{category}</MenuItem>
                })}
            </Select>
            </FormControl>
        </Box>
        </Modal>
     );
}

export default CreateEventForm;