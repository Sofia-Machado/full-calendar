import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from "@fullcalendar/daygrid";
import { Button, Container, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { useUpdateEvent, useAddEvent } from '../hooks/eventHook';
import CreateEventForm from './CreateEventForm';
import ClientForm from './ClientForm';
import DragOrDuplicateForm from './DragOrDuplicateForm';
import DraggableEvents from './DraggableEvents';
import OptionsHeader from './OptionsHeader';

/* Fetch and remove functions */
const fetchEvents = () => {
  return axios.get("http://localhost:8080/events")
}

/* Component Demo App */
export function DemoApp() {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [eventInfo, setEventInfo] = useState({});
  const [eventRemoved, setEventRemoved] = useState({});
  const [oldEventDrag, setOldEventDrag] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dragId, setDragId] = useState(null);
  const [slotDuration, setSlotDuration] = useState("00:15:00");
  const [filters, setFilters] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDragForm, setOpenDragForm] = useState(false);
  
  const calendar = useRef(null);
  const draggableRef = useRef(null);
  const queryClient = useQueryClient();
  
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
    const removeEvents =  useMutation(async (id, options) => {
      await axios.delete(`http://localhost:8080/events/${id}`, {options})  
    })
    const removeDraggableEvents = useMutation((id, options) => {
      return axios.delete(`http://localhost:8080/dragItemList/${id}`, {options})})

  //Filter Events
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
  //function
  const handleFilter = (e) => {
    const newFilters = e.target.value;
    setFilters(newFilters);
    const newEvents = filterEvents(events.data, newFilters);
    setVisibleEvents(newEvents);
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
          return {
            ...data,
            id: data.id + 'duplicate'
          };
        }
      });
    }
  }, [isLoading])

  /* Remove event */
  const handleEventRemove = (id) => {
    let calendarApi = calendar.current.getApi();
    let eventData = calendarApi.getEventById(id);
    setEventRemoved(eventData);
    removeEvents.mutate(eventData.id, {
      onSuccess: () => {
        //eventData.remove();
        queryClient.invalidateQueries('events');
      },
      keepPreviousData: true,
    })
    setSnackbarMessage(`Deleted ${eventData.title}`)
    setOpenSnackbar(true);
    setOpenCreateForm(false);
  }
  
  const handleUndoRemove = (e) => {
    e.preventDefault();
    addNewEvent(calendar.current.calendar.addEvent({
      id: eventRemoved.id,
      title: eventRemoved.title,
      start: eventRemoved.start, 
      end: eventRemoved.end,
      extendedProps: {
        category: eventRemoved.extendedProps.category,
        mandatory: eventRemoved.extendedProps.mandatory
      },
      backgroundColor: eventRemoved.backgroundColor,
      borderColor: eventRemoved.backgroundColor
  }));
  setEventRemoved(null)
  setOpenSnackbar(false);
  }

  const handleCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const actionSnackbar = (
    <>
      <Button color="secondary" size="small" onClick={(e) => handleUndoRemove(e)}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  /* Open form */
  const handleOpenCreateForm = () => setOpenCreateForm(true);
  
 /* Update event drag and drop */
  const handleEventDrop = (event) => {
    setEventInfo(event.event.toPlainObject());
    setOldEventDrag(event.oldEvent.toPlainObject());
    setOpenDragForm(true);
  }

  /* Update/add event on receive */
  const handleEventReceive = (info) => {
    const event = info.event.toPlainObject();
    addNewEvent(event);
    removeDraggableEvents.mutate(dragId, {
      onSuccess: () => {
        queryClient.invalidateQueries('dragItems');
      }
    })
    let calendarApi = calendar.current.getApi()
    let eventData = calendarApi.getEventById(dragId).toPlainObject();
    updateExistingEvent({...eventData, classNames: 'duplicate'}, {
      onSuccess: () => {
      queryClient.invalidateQueries('events');
    }})
  }
  
  /* Event content Render */ 
  const eventContent = (eventInfo) => {
    const isMandatory = eventInfo.event.extendedProps.mandatory;
    const icon = isMandatory ? <i className="fa-solid fa-lock"></i> : null;
    let duplicate;
    let waitingList;
    if (!eventInfo?.event?.classNames?.includes('duplicate')) {
      duplicate = true;
    }
    if (!eventInfo?.event?.classNames?.includes('waiting-list')) {
      waitingList = true;
    }
    return (
      <div className="event-render">
        <p className="event-paragraph">
          <span className={isMandatory ? "" : "event-date"}
          onClick={() => { 
            if (!isMandatory) {
              handleOpenCreateForm();
            }
            }}>{eventInfo.timeText}</span>
          <Link to={`/client/${eventInfo.event.id}`} target='_blank'
          style={{ textDecoration: 'none', color: "inherit"}}>
          <span className='event-title' 
          //onClick={handleOpenClientForm}
          >{icon ? <i>{icon}</i> : null}{eventInfo.event.title}</span>
          </Link>
          <em> - {eventInfo.event.extendedProps.category}</em>
          {duplicate ?? 'duplicated'}
          {waitingList ?? 'waiting-list'}
        </p>
      </div>
    )
  }
  const now = dayjs().format();
  /* Calendar options */
  const options = {
    plugins: [
      dayGridPlugin,
      timeGridPlugin, 
      interactionPlugin 
    ],
    allDaySlot: false,
    eventMaxStack: 4,
    dayPopoverFormat:{
      title: 'hello',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    },
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
    eventConstraint: {
      start: now
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
    eventDrop: handleEventDrop,
    eventReceive: handleEventReceive,
    eventRemove: handleEventRemove,
    //save date
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

  return (
    <div className='calendar-app'>
        <h1>Call-endar</h1>
      <Container>
        <OptionsHeader 
          events={events} setEventInfo={setEventInfo}
          filters={filters} handleFilter={handleFilter}
          handleOpenCreateForm={handleOpenCreateForm}
          slotDuration={slotDuration} setSlotDuration={setSlotDuration}
        />
        <div className='calendar-list-container'>
          <div className="draggables" ref={draggableRef}>
            <DraggableEvents
             events={events} calendar={calendar} 
             updateExistingEvent={updateExistingEvent} 
             addNewEvent={addNewEvent} 
             removeDraggableEvents={removeDraggableEvents} 
             startDate={startDate} endDate={endDate} 
            />
          </div>
          <FullCalendar
            ref={calendar}
            {...options}
            events={visibleEvents}
            eventContent={eventContent}
            eventClick={(e) => {
              setEventInfo(e.event);
              //handleOpenCreateForm();
            }}
            headerToolbar={{
              start: '',
              center: '',
              end: 'title today prev,next',
            }}
          />
        </div>
      <DragOrDuplicateForm 
        openDragForm={openDragForm} setOpenDragForm={setOpenDragForm} 
        eventInfo={eventInfo} 
        oldEventDrag={oldEventDrag}
        addNewEvent={addNewEvent}
        updateExistingEvent={updateExistingEvent}
        removeDraggableEvents={removeDraggableEvents}
      />
      <CreateEventForm 
        handleEventRemove={handleEventRemove} 
        calendar={calendar} 
        eventInfo={eventInfo} setEventInfo={setEventInfo}
        openCreateForm={openCreateForm} setOpenCreateForm={setOpenCreateForm} 
        startDate={startDate} setStartDate={setStartDate} 
        endDate={endDate} setEndDate={setEndDate}
      />
      {/* <ClientForm 
        eventInfo={eventInfo}
        openClientForm={openClientForm}
        setOpenClientForm={setOpenClientForm}
      /> */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={actionSnackbar}
      />
      </Container>
    </div>
  )
}