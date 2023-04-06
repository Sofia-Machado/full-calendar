import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRef, useState } from 'react';
import CreateEventForm from './CreateEventForm';
import  { dataCategories } from '../data/eventData';

export function DemoApp() {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const handleOpenCreateForm = () => {
    setOpenCreateForm(true);
  };

  //calendar options
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
      handleOpenCreateForm();
     console.log(start.startStr)
    },
  }

  const events = [
    { title: 'Meeting', start: new Date() }
  ]
  
  return (
    <div>
      <h1>Demo App</h1>
      <FullCalendar
      ref={calendar}
      {...options}
        events={events}
      />
     <CreateEventForm openCreateForm={openCreateForm} setOpenCreateForm={setOpenCreateForm} />
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