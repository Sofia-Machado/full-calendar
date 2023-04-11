import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Modal, Select, Switch, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import  { dataCategories } from '../data/eventData';

const CreateEventForm = ({ calendar, eventInfo, handleEventRemove, openCreateForm, setOpenCreateForm, startDate, setStartDate, endDate, setEndDate}) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [mandatory, setMandatory] = useState(true);
    const [backColor, setBackColor] = useState('#3788d8');


  
  useEffect(() => {
      if (eventInfo) {
        setTitle(eventInfo.title);
        setCategory(eventInfo?.extendedProps?.category || '')
        setMandatory(eventInfo?.extendedProps?.mandatory || mandatory)
        setStartDate(dayjs(eventInfo.start));
        setEndDate(dayjs(eventInfo.end));
        setBackColor(eventInfo.backgroundColor);
    } else {
        setTitle('');
        setCategory('');
        setMandatory(mandatory);
        setBackColor(backColor);
    }
  }, [eventInfo]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };
      
    const handleCloseCreateForm = () => {
        setOpenCreateForm(false);
    };
        
    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };
    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
        if (event.target.value === 'Santé') {
            setBackColor('#e3ab9a');
        } else if ((event.target.value === 'Vie')) {
            setBackColor('#188038');
        } else {
            setBackColor('#3788d8');
        }
    };
    const handleChangeType = () => {
        setMandatory(prevState => !prevState);
    };
    const handleChangeStartDate = (date) => {
        setStartDate(date);
        // Check if start date is after end date
        if (dayjs(date).isAfter(dayjs(endDate)) || dayjs(date).isSame(dayjs(endDate))) {
          // If start date is after end date, set end date to start date + 1 hour
          setTimeout(() => setEndDate(dayjs(date).add(15, 'minutes')), 800); 
        }
      };
      const handleChangeEndDate = (date) => {
        setEndDate(date);
        // Check if end date is before start date
        if (dayjs(date).isBefore(dayjs(startDate)) || dayjs(date).isSame(dayjs(startDate))) {
          // If end date is before start date, set start date to end date - 1 hour
          setTimeout(() => setStartDate(dayjs(date).subtract(15, 'minutes')), 800);
        }
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!eventInfo || eventInfo.title === '') {
            calendar.current.calendar.addEvent({
                id: calendar.current.props.events.length + 1,
                title,
                start: startDate, 
                end: endDate,
                extendedProps: {
                    category,
                    mandatory,
                    resourceEditable: true,
                },
                backgroundColor: backColor,
                borderColor: backColor,
                editable: !mandatory
            });
            handleCloseCreateForm()
        }
        else {
            console.log(backColor)
            eventInfo.setProp('title', title)
            eventInfo.setStart(startDate)
            eventInfo.setEnd(endDate)
            eventInfo.setExtendedProp('category', category)
            eventInfo.setExtendedProp('mandatory', mandatory)
            eventInfo.setExtendedProp('resourceEditable', true)
            eventInfo.setProp('backgroundColor', backColor)
            eventInfo.setProp('borderColor', backColor)
            eventInfo.setProp('editable', !mandatory)
            console.log(eventInfo)
            handleCloseCreateForm()
        }
    }

    const handleDelete = () => {
        handleEventRemove(eventInfo.id);
        handleCloseCreateForm();
      };

    return (
        <form onSubmit={handleSubmit}>
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
                    id="create-event-title-textfield"
                    label="Insert Event"
                    placeholder="Insert event"
                    variant="standard"
                    value={title}
                    onChange={handleChangeTitle}
                    sx={{ display: 'grid' }}
                />
                <FormControl variant="standard" sx={{ display: 'grid', mt: 2 }}>
                    <InputLabel id="create-event-category">Category</InputLabel>
                    <Select
                        required
                        id="create-event-category-select"
                        label="Choose category"
                        placeholder='Choose category'
                        onChange={handleChangeCategory}
                        value={category}
                    >
                        {dataCategories.map(dateCategory => {
                            return <MenuItem key={dateCategory} value={dateCategory}>{dateCategory}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <FormGroup sx={{mt: 2}}>
                    <FormControlLabel control={<Switch color='error' checked={mandatory} onChange={handleChangeType} />} label="Obligatoire" />
                </FormGroup>
                <LocalizationProvider dateAdapter={AdapterDayjs}  >
                    <DemoContainer components={['DateTimePicker', 'DateTimePicker']} >
                        <DateTimePicker
                        label="Start Date"
                        value={dayjs(startDate)}
                        onChange={handleChangeStartDate}
                        ampm={false}
                        />
                        <DateTimePicker
                        label="End Date"
                        value={dayjs(endDate)}
                        onChange={handleChangeEndDate}
                        minTime={dayjs(startDate)}
                        ampm={false}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <Button type="submit" variant="outlined" sx={{mt: 3}}>Submit</Button>
                {eventInfo &&
                <Button onClick={handleDelete} sx={{mt: 3}}><DeleteIcon /></Button>
                }
            </Box>
            </Modal>
        </form> 
     );
}

export default CreateEventForm;