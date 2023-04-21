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
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [mandatory, setMandatory] = useState(false);
    const [backColor, setBackColor] = useState('#3788d8');
    const [timeoutFunc, setTimeoutFunc] = useState(null);    
    const [currentError, setCurrentError] = useState(null);

    const form = useForm({
        defaultValues: {
            title: '',
            extendedProps: {
                category: '',
                mandatory: false,
            }
        }
    });
    const { register, control, handleSubmit, formState, watch, getValues, setValue } = form;
    const { errors, touchedFields, dirtyFields } = formState;

    const dataCategories = ['Santé', 'Vie'];
    
    const { mutate:addNewEvent } = useAddEvent();
    const { mutate:updateExistingEvent } = useUpdateEvent();
    const queryClient = useQueryClient();
  
    /* Set states */
    useEffect(() => {
        if (eventInfo) {
            setTitle(eventInfo.title);
            setCategory(eventInfo?.extendedProps?.category || '')
            setMandatory(eventInfo?.extendedProps?.mandatory)
            setStartDate(dayjs(eventInfo.start));
            setEndDate(dayjs(eventInfo.end));
            setBackColor(eventInfo.backgroundColor);
        } else {
            setTitle('')
            setCategory('')
        }
    }, [eventInfo]);

    /* Handle States */
    
    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
        if (event.target.value === 'Santé') {
            setBackColor('#e3ab9a');
        } else if ((event.target.value === 'Vie')) {
            setBackColor('#44936c');
        } else {
            setBackColor('#3788d8');
        }
    };

    const handleChangeStartDate = (date) => {
        let isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
        dayjs.extend(isSameOrAfter);
        setStartDate(date);
        // Check if start date is after end date
        if (dayjs(date).isSameOrAfter(endDate)) {
          setEndDate(dayjs(date).add(15, 'minutes')); 
        }
    };
    const handleChangeEndDate = (date) => {
    let isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
    dayjs.extend(isSameOrBefore);
    setEndDate(date);
        // Check if end date is before start date
        if (dayjs(date).isSameOrBefore(startDate)) {
            setStartDate(dayjs(date).subtract(15, 'minutes'));
        }
    };

    /* Close Form */
    const handleCloseCreateForm = () => {
        setOpenCreateForm(false);
    };

    const onSubmit = (data) => {
        console.log('form submitted', data)
    }
    
    /* Submit Event */
   /*  const handleSubmit = (event) => {
        event.preventDefault();
        console.log(event.nativeEvent.submitter.name)
        if (!eventInfo || eventInfo.title === '') {
            addNewEvent(calendar.current.calendar.addEvent({
                //id: calendar.current.props.events.length + 1,
                title,
                start: startDate, 
                end: endDate,
                extendedProps: {
                    category,
                    mandatory
                },
                backgroundColor: backColor,
                borderColor: backColor
            })
        )} else {
            if (event.nativeEvent.submitter.name === 'replace') {
                updateExistingEvent({ 
                    title,
                    id: eventInfo.id,
                    start: startDate,
                    end: endDate,
                    extendedProps: {
                        category,
                        mandatory,
                    },
                    backgroundColor: backColor,
                    borderColor: backColor
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('events')
                    }
                })
            } 
            if (event.nativeEvent.submitter.name === 'duplicate') {
                console.log(eventInfo)
                updateExistingEvent({
                    id: eventInfo.id,
                    title,
                    start: eventInfo.start,
                    end: eventInfo.end,
                    extendedProps: {
                        category,
                        mandatory,
                    },
                    classNames: 'duplicate',
                    backgroundColor: backColor,
                    borderColor: backColor
                })
                addNewEvent({
                    id: eventInfo.id + 'duplicate',
                    title,
                    start: startDate, 
                    end: endDate,
                    extendedProps: {
                        category,
                        mandatory
                    },
                    backgroundColor: backColor,
                    borderColor: backColor
                    
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('events')
                    }
                });
                
            }  
        }
        handleCloseCreateForm()
        setTitle('');
        setCategory('');
        setMandatory(false);
    } */

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
            >
            <Box component='form' 
            autoComplete="off"
            sx={{ ...style, width: 400 }}
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
                    helperText={errors  && errors.title?.message}
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
                            onChange={onChange}
                            value={value}
                        >
                        {dataCategories.map(dataCategory => {
                            return <MenuItem key={dataCategory} value={dataCategory}>{dataCategory}</MenuItem>
                        })}
                        </Select>
                    </FormControl>
                }/>
                <Controller
                name='extendedProps.mandatory'
                control={control}
                render={
                    ({ field: { onChange, value, name } }) =>
                <FormGroup sx={{mt: 2}}>
                    <FormControlLabel control={<Switch color='error' checked={value} onChange={onChange} />} label="Obligatoire" />
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
                            defaultValue={dayjs(startDate)}
                            value={dayjs(startDate)}
                            rules={{ required: true }}
                            onChange={(date) => {
                                clearTimeout(timeoutFunc);
                                const newTimeout = setTimeout(() => {
                                    let isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
                                    dayjs.extend(isSameOrAfter);
                                    setStartDate(date);
                                    // Check if start date is after end date
                                    if (dayjs(date).isSameOrAfter(endDate)) {
                                        setEndDate(dayjs(date).add(15, 'minutes'));
                                        setValue('end', dayjs(date).add(15, 'minutes'))
                                    } 
                                    onChange(date);
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
                            defaultValue={dayjs(endDate)}
                            value={dayjs(endDate)}
                            rules={{ required: true }}
                            onChange={(date) => {
                                clearTimeout(timeoutFunc);
                                const newTimeout = setTimeout(() => {
                                    let isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
                                    dayjs.extend(isSameOrBefore);
                                    setEndDate(date);
                                        // Check if end date is before start date
                                        if (dayjs(date).isSameOrBefore(startDate)) {
                                            setStartDate(dayjs(date).subtract(15, 'minutes'));
                                            setValue('start', dayjs(date).subtract(15, 'minutes'))
                                        }
                                    onChange(date);
                                }, 300);
                            setTimeoutFunc(newTimeout);
                            }}
                            ampm={false}
                            minTime={dayjs(startDate)}
                            maxTime={dayjs().set('hour', 18)}
                            error={currentError}
                            onError={(reason, value) => {
                                if (reason) {
                                setCurrentError(reason);
                                } else {
                                setCurrentError(null);
                                }
                            }}
                            helperText={currentError === 'disablePast' ? 'Insert valid date' : ''}
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