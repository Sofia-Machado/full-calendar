import { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { Draggable, EventDropArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import CreateEventForm from './CreateEventForm';
import DraggableEvents from './DraggableEvents';
import { list, dragList } from '../data/eventData'
import dayjs from 'dayjs';

export function DemoApp() {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [eventInfo, setEventInfo] = useState({})
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [customEvents, setCustomEvents] = useState(list);

  const calendar = useRef();

  useEffect(() => {
    let now = dayjs().format();
    customEvents.forEach(event => {
      if (event?.extendedProps?.mandatory && (now > event.end)) {
        dragList.push(event);
      }
    })
  }, [customEvents])

  /* drag events */
  const draggableRef = useRef(null);
  useEffect(() => {
    if (draggableRef.current) {
      new Draggable(draggableRef.current, {
        itemSelector: ".draggable-item",
        eventData: function(eventEl) {
          const dataString = eventEl.getAttribute('data-event');
          const data = JSON.parse(dataString);
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
            editable: !mandatory,
            backgroundColor: backColor,
            borderColor: backColor,
          };
        }
      });
    }
  }, []);
  
  /* remove event */
  const handleEventRemove = (id) => {
    let calendarApi = calendar.current.getApi()
    let eventData = calendarApi.getEventById(id);
    //check if id exists
    if (eventData) {
      eventData.remove();
    }
    setOpenCreateForm(false);
  };

  /* open form */
  const handleOpenCreateForm = () => {
    setOpenCreateForm(true);
    console.log(eventInfo)
  };

  /* render event */
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
    )}
       
  /* calendar options */
  const options = {
    plugins: [
      timeGridPlugin, 
      interactionPlugin 
    ],
    //on drop
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