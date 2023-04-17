import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from "@fullcalendar/daygrid";
import { Autocomplete, Box, Chip, Container, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useUpdateEvent, useAddEvent } from '../hooks/eventHook';
import CustomHeader from './CustomHeader';
import CreateEventForm from './CreateEventForm';
import DraggableEvents from './DraggableEvents';

/* Fetch and remove functions */
const fetchEvents = () => {
  return axios.get("http://localhost:8080/events")
}
const removeEvents = (id, options) => {
  return axios.delete(`http://localhost:8080/events/${id}`)
    .then(response => {
      if (options && options.onSuccess) {
        options.onSuccess(response);
      }
      return response;
    });
}
const removeDraggableEvents = (id, options) => {
  return axios.delete(`http://localhost:8080/dragItemList/${id}`)
    .then(response => {
      if (options && options.onSuccess) {
        options.onSuccess(response);
      }
      return response;
    });
}

/* Component Demo App */
export function DemoApp() {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [eventInfo, setEventInfo] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dragId, setDragId] = useState(null);
  const [slotDuration, setSlotDuration] = useState("00:15:00");
  const [filters, setFilters] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([])
  
  const calendar = useRef(null);
  const draggableRef = useRef(null);
  const queryClient = useQueryClient();
  const theme = useTheme();
  
  const onSuccess = (response) => {
    console.log('success');
    const events = filterEvents(response.data, filters);
    setVisibleEvents(events);
  }
  const onError = () => {
    console.log('error')
  }
  
  /* Fetch and mutate data */
  const { isLoading, data: events, isError, error } = useQuery('events', fetchEvents,
    {
      onSuccess,
      onError
    })
    const { mutate:updateExistingEvent } = useUpdateEvent();
    const { mutate:addNewEvent } = useAddEvent();

  const filterEvents = (events, currentFilters) => {
    if (currentFilters.length === 0) {
      return events;
    }
    return events.filter((event) => {
      if (currentFilters.includes('Obligatoire')) {
        return event.extendedProps.mandatory;
      }
      return currentFilters.includes(event.extendedProps.category)
    })
  }

  /* Drag event info */
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
          };
        }
      });
    }
  }, [isLoading])

  /* Remove event */
  const handleEventRemove = (id) => {
    let calendarApi = calendar.current.getApi()
    let eventData = calendarApi.getEventById(id);
      removeEvents(eventData.id, {
        onSuccess: () => {
          eventData.remove();
          console.log('deleted')
        }
      })
    setOpenCreateForm(false);
  };

  /* Open form */
  const handleOpenCreateForm = () => {
    setOpenCreateForm(true);
  };

  /* Update event drag and drop */
  const handleDrop = (info) => {
    const event = info.event.toPlainObject();
    if (event) {
      updateExistingEvent({...event, editable: !event.extendedProps.mandatory, 
        startEditable: !event.extendedProps.mandatory, 
        durationEditable: !event.extendedProps.mandatory})
    }
  }
  /* Update/add event on receive */
  const handleEventReceive = (info) => {
    const event = info.event.toPlainObject();
    if (info.event) {
      addNewEvent(calendar.current.calendar.addEvent({
        title: event.title,
        start: event.start,
        end: event.end,
        extendedProps : {
          category: event.extendedProps.category,
          mandatory: event.extendedProps.mandatory,
          resourceEditable: true
        },
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        editable: !event.extendedProps.mandatory, 
        startEditable: !event.extendedProps.mandatory, 
        durationEditable: !event.extendedProps.mandatory
      }, {
      }));
      updateExistingEvent({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        extendedProps : {
          category: event.extendedProps.category,
          mandatory: event.extendedProps.mandatory,
          resourceEditable: true
        },
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        editable: !event.extendedProps.mandatory, 
        startEditable: !event.extendedProps.mandatory, 
        durationEditable: !event.extendedProps.mandatory
      }, {
        })
      removeDraggableEvents(dragId, {
        onSuccess: () => {
          queryClient.invalidateQueries('dragItems');
        }
      })
    }
  }
  
  /* Event content Render */ 
  const eventContent = (eventInfo) => {
    const isMandatory = eventInfo.event.extendedProps.mandatory;
    const icon = isMandatory ? <i className="fa-solid fa-lock"></i> : null;
    return (
      <div className="event-render">
        <p className="event-paragraph">
          <span>{eventInfo.timeText}</span>
          <i>{icon}</i>
          {eventInfo.event.title}
          <em>{eventInfo.event.extendedProps.category}</em>
        </p>
      </div>
    )
  }

  /* Calendar options */
  const options = {
    plugins: [
      dayGridPlugin,
      timeGridPlugin, 
      interactionPlugin 
    ],
    allDaySlot: false,
    eventMaxStack: 4,
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
    eventChange: handleDrop,
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
  
  /* Set category options on the search bar */
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

  /* Menu filter */ 
  const filtersList = ['Obligatoire', 'Vie', 'Santé'];
  //styles
  function getStyles(filter, filtersList, theme) {
    return {
      fontWeight:
        filters.indexOf(filter) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }  
  //function
  const handleFilter = (e) => {
    const newFilters = e.target.value;
    setFilters(newFilters);
    const newEvents = filterEvents(events.data, newFilters);
    setVisibleEvents(newEvents);
  }



  return (
    <div className='calendar-app'>
        <h1>Call-endar</h1>
      <Container>
        <div className='mui-forms'>
          <Stack spacing={2} sx={{ ml: 25, width: 300 }}>
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
          <FormControl sx={{ mt: 2, width: 300 }}>
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
        </div>
        <FormControl>
            <FormLabel id="slot-duration-select">Slot Duration</FormLabel>
            <RadioGroup
              aria-labelledby="slot-duration-select-options"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              name="slot-duration-select-options"
              sx={{ display: "block" }}
            >
              <FormControlLabel
                value="00:15:00"
                control={<Radio size="small" />}
                label="15min"
              />
              <FormControlLabel
                value="00:30:00"
                control={<Radio size="small" />}
                label="30min"
              />
              <FormControlLabel
                value="01:00:00"
                control={<Radio size="small" />}
                label="1h"
              />
            </RadioGroup>
          </FormControl>
        <div className='calendar-list-container'>
          <div className="draggables" ref={draggableRef}>
            <DraggableEvents events={events} />
          </div>
          <FullCalendar
            ref={calendar}
            {...options}
            events={visibleEvents}
            eventContent={eventContent}
            eventClick={(e) => {
              setEventInfo(e.event);
              handleOpenCreateForm()
            }}
            
            headerToolbar={{
              start: '',
              center: '',
              end: 'title today prev,next',
            }}
          />
        </div>
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