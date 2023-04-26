import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { Box, Button, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Modal, Select, Switch, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { useAddEvent, useUpdateEvent } from '../../hooks/eventHook';

const CreateEventForm = ({ calendar, eventInfo, handleEventRemove, openCreateForm, setOpenCreateForm, startDate, setStartDate, endDate, setEndDate}) => {
    const [timeoutFunc, setTimeoutFunc] = useState(null);    
    const [currentError, setCurrentError] = useState(null);

    const form = useForm({
    });


    const { register, control, handleSubmit, formState, reset, setValue } = form;
    const { errors } = formState;
    
    const { mutate:addNewEvent } = useAddEvent();
    const { mutate:updateExistingEvent } = useUpdateEvent();
    const queryClient = useQueryClient();
  
    useEffect(() => {
        reset({
            title: eventInfo?.title || '',
            extendedProps: {
              category: eventInfo?.extendedProps?.category || '',
              mandatory: eventInfo?.extendedProps?.mandatory || false,
            },
            color: eventInfo?.extendedProps?.category === 'Santé' ? '#e3ab9a' : '#44936c',
            start: eventInfo?.start || startDate,
            end: eventInfo?.end || endDate,
          });
        }, [reset, eventInfo, openCreateForm]);

    /* Close Form */
    const handleCloseCreateForm = () => {
        setOpenCreateForm(false);
    };

    const onSubmit = (data, e) => {
        if (!eventInfo || eventInfo.title === '') {
            data.start = dayjs(startDate).toDate();
            data.end = dayjs(endDate).toDate();
            console.log(data)
            addNewEvent(calendar.current.calendar.addEvent(data))
        } else {
            if (e.nativeEvent.submitter.name === 'replace') {
                updateExistingEvent({
                    ...data,
                    id: eventInfo.id
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('events')
                    }
                })
            } 
            if (e.nativeEvent.submitter.name === 'duplicate') {
                updateExistingEvent({
                    id: eventInfo.id,
                    ...data,
                    classNames: 'duplicate',
                    startEditable: !eventInfo?.extendedProps?.mandatory,
                    durationEditable: !eventInfo?.extendedProps?.mandatory,
                    editable: !eventInfo?.extendedProps?.mandatory
                })
                addNewEvent(calendar.current.calendar.addEvent({
                    id: eventInfo.id + 'duplicate',
                    ...data
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('events')
                    }
                }));
                
            }  
        }
        handleCloseCreateForm();
        reset();
    }
    
    /* Delete Event */
    const handleDelete = () => {
        handleEventRemove(eventInfo.id);
        handleCloseCreateForm();
    };

    /* Box Style */
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
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Modal
            open={openCreateForm}
            onClose={handleCloseCreateForm}
            aria-labelledby="create-event-form"
            aria-describedby="form-to-add-event-to-calendar"
            sx={{borderRaidus: 20}}
            >
            <Box component='form' 
            autoComplete="off"
            sx={{ ...style, width: 400, borderRadius: 5, onFocusVisible: { border: 'none'} }}
            >
                <h2 id="create-event-title">{eventInfo ? 'Update Event' : 'Create Event'}</h2>
                <TextField
                    id="create-event-title-textfield"
                    label="Insert Event"
                    placeholder="Insert event"
                    variant="standard"
                    //react form track state
                    {...register('title', {
                        required: 'Username is required',
                        validate: {
                            notBlank: (fieldValue) => {
                            return (
                                fieldValue !== ' ' || 
                                'Enter a valid title'
                                );
                            },}
                    })}
                    helperText={errors && errors.title?.message}
                    sx={{ display: 'grid' }}
                /> 
                <Controller
                name='extendedProps.category'
                control={control}
                render={
                    ({ field: { onChange, value, name } }) =>
                    <FormControl variant="standard" sx={{ display: 'grid', mt: 2 }}>
                        <InputLabel id="create-event-category">Category</InputLabel>
                        <Select
                            required
                            id="create-event-category-select"
                            label="Choose category"
                            placeholder='Choose category'
                            onChange={(e) => {
                                if (e.target.value === 'Santé') {
                                    setValue('color', '#e3ab9a')
                                } else {
                                    setValue('color', '#44936c')
                                }
                                onChange(e.target.value)}}
                            value={value}
                            name={name}
                            rules={{
                                required: 'Category is required'
                            }}
                            helperText={errors && errors.extendedProps?.category?.message}
                        >
                             <MenuItem key='sante' value='Santé'>Santé</MenuItem>
                             <MenuItem key='vie' value='Vie'>Vie</MenuItem>
                        
                        </Select>
                    </FormControl>
                }/>
                <Controller
                name='extendedProps.mandatory'
                control={control}
                render={
                    ({ field: { onChange, value, name } }) =>
                <FormGroup sx={{mt: 2}}>
                    <FormControlLabel control={<Switch color='error' checked={value} name={name} onChange={onChange} />} label="Obligatoire" />
                </FormGroup>
                }/>
                <Controller
                name="start"
                control={control}
                render={
                    ({ field: { onChange, value, name } }) =>
                    <LocalizationProvider dateAdapter={AdapterDayjs}  >
                        <DemoContainer components={['DateTimePicker']} >
                            <DateTimePicker
                            label="Start Date"
                            name={name}
                            value={dayjs(value)}
                            rules={{ required: true }}
                            onChange={(date) => {
                                clearTimeout(timeoutFunc);
                                setStartDate(dayjs(date));
                                const newTimeout = setTimeout(() => {
                                    let isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
                                    dayjs.extend(isSameOrAfter);
                                    // Check if start date is after end date
                                    if (dayjs(date).isSameOrAfter(endDate)) {
                                        setEndDate(dayjs(date).add(15, 'minutes'));
                                        setValue('end', dayjs(date).add(15, 'minutes'))
                                    } 
                                    onChange(dayjs(date));
                                }, 300);
                            setTimeoutFunc(newTimeout);
                            }}
                            ampm={false}
                            minTime={dayjs().set('hour', 7)}
                            maxTime={dayjs().set('hour', 18)}
                            onError={(reason, value) => {
                                if (reason) {
                                setCurrentError(reason)
                                } else {
                                setCurrentError(null);
                                }
                            }}
                            error={currentError}
                            helperText={errors && currentError === 'disablePast' ? 'Insert a future date' : 'Insert valid date'}
                            disablePast
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                }
                /> 
                <Controller
                name="end"
                control={control}
                render={
                    ({ field: { onChange, value, name } }) =>
                    <LocalizationProvider dateAdapter={AdapterDayjs}  >
                        <DemoContainer components={['DateTimePicker']} >
                            <DateTimePicker
                            label="End Date"
                            name={name}
                            value={dayjs(value)}
                            //value={dayjs(endDate)}
                            rules={{ required: true }}
                            onChange={(date) => {
                                clearTimeout(timeoutFunc);
                                setEndDate(dayjs(date));
                                const newTimeout = setTimeout(() => {
                                    let isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
                                    dayjs.extend(isSameOrBefore);
                                        // Check if end date is before start date
                                        if (dayjs(date).isSameOrBefore(startDate)) {
                                            setStartDate(dayjs(date).subtract(15, 'minutes'));
                                            setValue('start', dayjs(date).subtract(15, 'minutes'))
                                        }
                                    onChange(dayjs(date));
                                }, 300);
                            setTimeoutFunc(newTimeout);
                            }}
                            ampm={false}
                            minTime={startDate}
                            maxTime={dayjs().set('hour', 18)}
                            error={currentError}
                            onError={(reason, value) => {
                                if (reason) {
                                setCurrentError(reason);
                                } else {
                                setCurrentError(null);
                                }
                            }}
                            helperText={currentError === 'disablePast' ? 'Insert a future date' : 'Insert valid date'}
                            disablePast
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                    }
                /> 
                {!eventInfo && <Button type="submit" variant="outlined" sx={{mt: 3}}>Submit</Button>}
                {eventInfo &&
               (<>
                <Button type="submit" variant="outlined" name='replace' value='replace' sx={{mt: 3, mr: 1}}>Replace</Button>
                <Button type="submit" variant="outlined" name='duplicate' value='duplicate' sx={{mt: 3}}>Duplicate</Button>
                <Button onClick={handleDelete} sx={{mt: 3}}><DeleteIcon /></Button>
               </>)}
            </Box>
            </Modal>
            <DevTool control={control} className='devTool' />
        </form> 
     );
}

export default CreateEventForm;