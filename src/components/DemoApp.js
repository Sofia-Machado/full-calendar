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
            resourceEditable: true,
          },
          start: todayStr + 'T12:00:00',
          end: todayStr + 'T13:00:00',
          backgroundColor: '#e3ab9a',
          borderColor: '#e3ab9a',
          editable: false,
          classNames: 'mandatory'
      },
      {
          id: 2,
          title: 'Call Sandra',
          extendedProps: {
            category: 'Vie',
            mandatory: false,
            resourceEditable: true,
            editable: true,
          },
          start: todayStr + 'T14:00:00',
          end: todayStr + 'T14:15:00',
          backgroundColor: '#44936c',
          borderColor: '#44936c',
          classNames: ''
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
    if (draggableRef.current) {
      new Draggable(draggableRef.current, {
        itemSelector: ".draggable-item",
        eventData: function(eventEl) {
          let data = eventEl.getAttribute('data-event');
          console.log(data['title'])
          const title = eventEl.getAttribute('data-title');
          const category = eventEl.getAttribute('extendedProps'[0]);
          const mandatory = eventEl.getAttribute('extendedProps'[1]);
          return {
            id: calendar.current.props.events.length + 1,
            title: title,
            startEditable: true,
            extendedProps: {
              category: category,
              mandatory: mandatory
            },
            editable: !mandatory,
            resourceEditable: true,
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

  const eventContent = (eventInfo) => {
    const isMandatory = eventInfo.event.extendedProps.mandatory;
    const icon = isMandatory ? <i className="fa-solid fa-lock"></i> : null;
    return (
      <div className="event-render">
        <b>{eventInfo.timeText}</b>
        <span>{icon}</span>
        <i>{eventInfo.event.title}</i>
        <em>{eventInfo.event.extendedProps.category}</em>
      </div>
    )}
       
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
        ref={calendar}
        {...options}
        events={customEvents}
        eventContent={eventContent}
        eventClick={(e) => {
          setEventInfo(e.event);
          handleOpenCreateForm()
        }}
      />
     <CreateEventForm handleEventRemove={handleEventRemove} customEvents={customEvents} calendar={calendar} eventInfo={eventInfo} setEventInfo={setEventInfo} openCreateForm={openCreateForm} setOpenCreateForm={setOpenCreateForm} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}  />
    </div>
  )
}