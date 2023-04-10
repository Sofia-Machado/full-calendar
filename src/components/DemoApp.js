import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRef, useState } from 'react';
import CreateEventForm from './CreateEventForm';
import DraggableEvents from './DraggableEvents';

const events = [
  { title: 'Meeting', start: new Date() }
]

let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
  const list = [
      {
          id: 1,
          title: 'Call Julia',
          category: 'Santé',
          mandatory: true,
          start: todayStr + 'T12:00:00',
          end: todayStr + 'T13:00:00'
      },
      {
          id: 2,
          title: 'Call Sandra',
          category: 'Vie',
          mandatory: false,
          start: todayStr + 'T14:00:00',
          end: todayStr + 'T14:15:00'
      }
  ]


export function DemoApp() {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [eventInfo, setEventInfo] = useState({})
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [customEvents, setCustomEvents] = useState(list);

  
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
    droppable: true,
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
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: false
    },
    nowIndicator: true,
    selectable: true,
    editable: true,
    select: function(info) {
      if (info.start && !info.event) {
        setEventInfo(null);
      }
      setStartDate(info.startStr.slice(0 , 19));
      setEndDate(info.endStr.slice(0 , 19));
      handleOpenCreateForm();
    },
  }
  
  return (
    <div>
      <h1>Demo App</h1>
      <FullCalendar
        ref={calendar}
        {...options}
        events={customEvents}
        eventContent={renderEventContent}
        eventClick={(e) => {
          setEventInfo(e.event);
          handleOpenCreateForm()
        }}
      />
     <CreateEventForm customEvents={customEvents} calendar={calendar} eventInfo={eventInfo} setEventInfo={setEventInfo} openCreateForm={openCreateForm} setOpenCreateForm={setOpenCreateForm} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}  />
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