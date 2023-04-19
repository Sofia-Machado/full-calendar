import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAddDragItem } from '../hooks/eventHook';
import { Card, CardContent, Tooltip, Typography } from '@mui/material';
import Zoom from '@mui/material/Zoom';

const DraggableEvents = ({addNewEvent, events, calendar, removeDraggableEvents, updateExistingEvent}) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const now = dayjs().format();
  
  const fecthDraggableItems = () => {
    return axios.get("http://localhost:8080/dragItemList")
  }
  const { mutate: addDragItem } = useAddDragItem();
  const queryClient = useQueryClient();

  /* fetch */
  const { isLoading, data: draggableList, isError, error } = useQuery('dragItems', fecthDraggableItems)

  useEffect(() => {
    if (draggableList) {
      events.data.forEach(event => {
        if (!draggableList.data.some(item => item.id === event.id)) {
          if (event?.extendedProps?.mandatory && now > event.end) {
            if (!event?.classNames?.includes('duplicate')) {
              addDragItem({
                ...event,
                classNames: 'past'
              }, {
                onSuccess: () => {
                  queryClient.invalidateQueries('dragItems');
                }
              });
              updateExistingEvent({
                ...event,
                classNames: 'waiting-list'
              })
            }
          }
        }
      })
    }
  }, [events])
 
  const handleItemClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedItemId === item.id) {
      setSelectedItemId(null); // deselect item if already selected
    } else {
      setSelectedItemId(item.id); // select item
    };
    if (e.detail === 2) {
      console.log(item);
      let calendarApi = calendar.current.getApi()
      let eventData = calendarApi.getEventById(selectedItemId).toPlainObject();
      console.log(eventData)
      updateExistingEvent({...eventData, classNames: 'duplicate'});
      removeDraggableEvents.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries('dragItems');
        }
      })
      addNewEvent(calendar.current.calendar.addEvent({
        ...item,
          id: item.id + 'duplicate',
          start: now,
          end: dayjs().add(15, 'minutes').format()
      }), {
        onSuccess: () => {
        queryClient.invalidateQueries('events');
      }});
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>
  }
  if (isError) {
    return <h2>{error.message}</h2>
  }

  return (
    <ul className="draggable-list">
      <Typography variant='title' component='h2' mb={2} sx={{textAlign: 'center', fontSize: 18, fontWeight: 400}}>Évènements à venir</Typography>
      {draggableList?.data.map((item, index) => {
        const isSelected = selectedItemId === item.id;
        return (
          <Tooltip sx={{m: 0}} title={item?.classNames?.includes('past') ? "Reporter" : ''} TransitionComponent={Zoom} arrow>
            <Card className="draggable-card" sx={{borderRadius: 20}} key={index} >
              <CardContent
              data-event={JSON.stringify(item)}
              className={`draggable-item ${isSelected ? 'selected' : ''}`}
              draggable={true}
              onClick={(e) => handleItemClick(e, item)}
              >
                <Typography fontSize={14} sx={{fontWeight: 500}} component="div">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        );
      })}
    </ul>
  );
};

export default DraggableEvents;