import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Autocomplete, Box, Chip, Container, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, MenuItem, MenuProps, OutlinedInput, Radio, RadioGroup, Select, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useUpdateEvent, useAddEvent } from '../hooks/eventHook';
import CreateEventForm from './CreateEventForm';
import DraggableEvents from './DraggableEvents';

/* Fetch and remove functions */
const fetchEvents = () => {
  return axios.get("http://localhost:8001/events")
}
const removeEvents = (id, options) => {
  return axios.delete(`http://localhost:8001/events/${id}`)
    .then(response => {
      if (options && options.onSuccess) {
        options.onSuccess(response);
      }
      return response;
    });
}
const removeDraggableEvents = (id, options) => {
  return axios.delete(`http://localhost:8001/dragItemList/${id}`)
    .then(response => {
      if (options && options.onSuccess) {
        options.onSuccess(response);
      }
      return response;
    });
}

/* Component DemoApp */
export function DemoApp() {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [eventInfo, setEventInfo] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dragId, setDragId] = useState(null);
  const [slotDuration, setSlotDuration] = useState("00:15:00")
  const [filters, setFilters] = useState([])
  
  const calendar = useRef(null);
  const draggableRef = useRef(null);
  const queryClient = useQueryClient();
  const theme = useTheme();
  
  const onSuccess = () => {
    console.log('success')
  }
  const onError = () => {
    console.log('error')
  }
  
  //fetch and mutate data
  const { isLoading, data: events, isError, error } = useQuery('events', fetchEvents,
    {
      onSuccess,
      onError
    })
    const { mutate:updateExistingEvent } = useUpdateEvent();
    const { mutate:addNewEvent } = useAddEvent();

  //drag event info
  useEffect(() => {
    if (draggableRef.current) {
      new Draggable(draggableRef.current, {
        itemSelector: ".draggable-item",
        eventData: function(eventEl) {
          const dataString = eventEl.getAttribute('data-event');
          const data = JSON.parse(dataString);
          setDragId(data.id);
          const title = data.title;
          const category = data.extendedProps.category;
          const mandatory = data.extendedProps.mandatory;
          let backColor = '#3788d8';
          if(category === 'Santé') {
            backColor = '#e3ab9a'
          } else if ((category === 'Vie')) {
            backColor = '#44936c'
          };
          return {
            id: calendar.current.props.events.length + 1,
            title: title,
            duration: '00:15',
            extendedProps: {
              category: category,
              mandatory: mandatory,
              resourceEditable: true,
            },
            backgroundColor: backColor,
            borderColor: backColor,
            startEditable: !mandatory,
            durationEditable: !mandatory,
            editable: !mandatory,
            display: 'block',
          };
        }
      });
    }
  }, [isLoading])

  //remove event
  const handleEventRemove = (id) => {
    let calendarApi = calendar.current.getApi()
    let eventData = calendarApi.getEventById(id);
    //check if id exists
      removeEvents(eventData.id, {
        onSuccess: () => {
          queryClient.invalidateQueries('events');
        }
      })
    setOpenCreateForm(false);
  };

  //open form
  const handleOpenCreateForm = () => {
    setOpenCreateForm(true);
  };

  //update event drag and drop
  const handleDrop = (info) => {
    const event = info.event.toPlainObject();
    if (event) {
      updateExistingEvent({...event})
    }
  }
 
  const handleEventReceive = (info) => {
    const event = info.event.toPlainObject();
    const mandatory = event.extendedProps.mandatory;
    if (info.event) {
      addNewEvent(calendar.current.calendar.addEvent({...event,
        id: calendar.current.props.events.length + 1,
      }, {
      }));
      updateExistingEvent({...event, startEditable: !mandatory,
        durationEditable: !mandatory,
        editable: !mandatory}, {
        })
      removeDraggableEvents(dragId, {
        onSuccess: () => {
          queryClient.invalidateQueries('dragItems');
        }
      })
    }
  }
  
  //event content 
  const eventContent = (eventInfo) => {
    //mandatory icon
    const isMandatory = eventInfo.event.extendedProps.mandatory;
    const icon = isMandatory ? <i className="fa-solid fa-lock"></i> : null;
    return (
      <div className="event-render">
        <b>{eventInfo.timeText}</b>
        <span>{icon}</span>
        <i>{eventInfo.event.title}</i>
        <em>{eventInfo.event.extendedProps.category}</em>
      </div>
    )
  }

  //calendar options
  const options = {
    plugins: [
      timeGridPlugin, 
      interactionPlugin 
    ],
    initialView: 'timeGridDay',
    weekends: false,
    slotMinTime: "09:00:00", 
    slotMaxTime: "18:00:01",
    slotDuration: slotDuration,
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: false
    },
    nowIndicator: true,
    selectable: true,
    editable: true,
    droppable: true,
    eventReceive: handleEventReceive,
    eventDrop: handleDrop,
    eventResize: handleDrop,
    eventRemove: handleEventRemove,
    //onclick
    select: function(info) {
      if (info.start && !info.event) {
        setEventInfo(null);
      }
      setStartDate(info.startStr.slice(0 , 19));
      setEndDate(info.endStr.slice(0 , 19));
      handleOpenCreateForm();
    },
  }

  if (isLoading) {
    return <h2>Loading...</h2>
  }
  if (isError) {
    return <h2>{error.message}</h2>
  }
  
  const categoryOptions = Object.values(events.data).sort((a, b) => {
    let result;
    if (a.extendedProps.category>b.extendedProps.category){
      result = -1;
  } else {
    if (a.extendedProps.category<b.extendedProps.category){
          result = 1;
    } else {
        if (a.title > b.title) {
          result = 1
        } else {
          if (a.title < b.title) {
            result = -1
          }
        }
      }
    }
    return result;
  });

  
  function getStyles(filter, filtersList, theme) {
    return {
      fontWeight:
        filters.indexOf(filter) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }  

  const filtersList = ['Mandatory', 'Vie', 'Santé'];
  const handleFilter = (e) => {
    setFilters(e.target.value)
    console.log(filters)
    events.data.forEach(event => {
      console.log(event)
      if (event.extendedProps.category !== e.target.value) {
        updateExistingEvent({...event, display: 'none'})
        //event.setProp('display', 'none')
      } 
      if (event.extendedProps.mandatory !== e.target.value)  {
        updateExistingEvent({...event, display: 'none'})

//        event.setProp('display', 'none')
      } else {
        updateExistingEvent({...event, display: 'block'})

//        event.setProp('display', 'block')
      }
    })
  }
  
  return (
    <div className='calendar-app'>
      <Container>
        <h1>Call-endar</h1>
        <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
          id="search-by-category"
          options={categoryOptions}
          groupBy={(option) => option.extendedProps.category}
          getOptionLabel={(option) => option.title}
          sx={{ width: 300 }}
          onChange={(e, value) => {
            console.log(value)
            setEventInfo(value);
            handleOpenCreateForm()
          }}
          renderInput={(params) => <TextField {...params}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          label="Search by category" />}
        />
        </Stack>
        <div className="draggables" ref={draggableRef}>
          <DraggableEvents events={events} />
        </div>
        <FormControl>
          <FormLabel id="slot-duration-select">Slot Duration</FormLabel>
          <RadioGroup
            aria-labelledby="slot-duration-select-options"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            name="slot-duration-select-options"
            sx={{display: "block"}}
          >
            <FormControlLabel value="00:15:00" control={<Radio size='small' />} label="15min" />
            <FormControlLabel value="00:30:00" control={<Radio size='small' />} label="30min" />
            <FormControlLabel value="01:00:00" control={<Radio size='small' />} label="1h" />
          </RadioGroup>
        </FormControl>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-chip-label">Filter</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={filters}
            onChange={handleFilter}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            //MenuProps={MenuProps}
          >
            {filtersList.map((filter) => (
              <MenuItem
                key={filter}
                value={filter}
                style={getStyles(filter, filtersList, theme)}
              >
                {filter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FullCalendar
          ref={calendar}
          {...options}
          events={events.data}
          eventContent={eventContent}
          eventClick={(e) => {
            setEventInfo(e.event);
            handleOpenCreateForm()
          }}
        />
      <CreateEventForm 
        handleEventRemove={handleEventRemove} 
        calendar={calendar} 
        eventInfo={eventInfo} setEventInfo={setEventInfo}
        openCreateForm={openCreateForm} setOpenCreateForm={setOpenCreateForm} 
        startDate={startDate} setStartDate={setStartDate} 
        endDate={endDate} setEndDate={setEndDate} />
      </Container>
    </div>
  )
}