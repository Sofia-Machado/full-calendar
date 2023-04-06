import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRef, useState } from 'react';
import { Box, Modal, TextField } from '@mui/material';


export function DemoApp() {
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
  
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
  const events = [
    { title: 'Meeting', start: new Date() }
  ]

  const calendar = useRef();

  const options = {
    plugins: [
      timeGridPlugin, 
      interactionPlugin 
    ],
    initialView: 'timeGridDay',
    weekends: false,
    slotMinTime: "09:00:00", 
    slotMaxTime: "18:00:01",
    slotDuration: "00:15:00",
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    },
    nowIndicator: true,
    selectable: true,
    select: function(start, end) {
      handleOpen();
     console.log(start.startStr)
    },
  }

  const CreateEventForm = () => {
    return (
    <Modal
    open={open}
    onClose={handleClose}
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
          label="Required"
          defaultValue="Event"
          placeholder="Insert event"
          variant="standard"
        />
    </Box>
  </Modal>)
  }

  return (
    <div>
      <h1>Demo App</h1>
      <FullCalendar
      ref={calendar}
      {...options}
        events={events}
      />
     <CreateEventForm />
    </div>
  )
}

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}