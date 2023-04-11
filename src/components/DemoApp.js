import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { Draggable, EventDropArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRef, useState, useEffect } from 'react';
import CreateEventForm from './CreateEventForm';
import DraggableEvents from './DraggableEvents';

let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
  const list = [
      {
          id: 1,
          title: 'Call Julia',
          extendedProps: {
            category: 'Santé',
            mandatory: true,
          },
          start: todayStr + 'T12:00:00',
          end: todayStr + 'T13:00:00',
          backgroundColor: '#e3ab9a',
          borderColor: '#e3ab9a'
      },
      {
          id: 2,
          title: 'Call Sandra',
          extendedProps: {
            category: 'Vie',
            mandatory: false,
          },
          start: todayStr + 'T14:00:00',
          end: todayStr + 'T14:15:00',
          backgroundColor: '#188038',
          borderColor: '#188038'

      }
  ]


export function DemoApp() {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [eventInfo, setEventInfo] = useState({})
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [customEvents, setCustomEvents] = useState(list);

  const calendar = useRef();
  const draggableRef = useRef(null);




  useEffect(() => {
    console.log(draggableRef.current)
    if (draggableRef.current) {
      new Draggable(draggableRef.current, {
        eventData: function(eventEl) {
          const title = eventEl.getAttribute('data-title');
          const category = eventEl.getAttribute('data-category');
          const mandatory = eventEl.getAttribute('data-mandatory') === 'true';
          return {
            title: title,
            startEditable: true,
            extendedProps: {
              category: category,
              mandatory: mandatory
            }
          };
        }
      });
    }
  }, []);
  
  const handleEventRemove = (id) => {
    let calendarApi = calendar.current.getApi()
    let eventData = calendarApi.getEventById(id);
    //check if id exists
    if (eventData) {
      eventData.remove();
    }
    setOpenCreateForm(false);
  };
  
  const handleOpenCreateForm = () => {
    setOpenCreateForm(true);
  };
  
  //calendar options
  const options = {
    plugins: [
      timeGridPlugin, 
      interactionPlugin 
    ],
    droppable: true,
      eventReceive: function (info) {
    const event = info.event.toPlainObject();
    setCustomEvents([...customEvents, event]);
  },
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
    eventRemove: handleEventRemove,
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
      <div ref={draggableRef}>
        <DraggableEvents />
      </div>
      <FullCalendar
        className="calendar"
        ref={calendar}
        {...options}
        events={customEvents}
        eventContent={renderEventContent}
        eventClick={(e) => {
          setEventInfo(e.event);
          handleOpenCreateForm()
        }}
      />
     <CreateEventForm handleEventRemove={handleEventRemove} customEvents={customEvents} calendar={calendar} eventInfo={eventInfo} setEventInfo={setEventInfo} openCreateForm={openCreateForm} setOpenCreateForm={setOpenCreateForm} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}  />
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