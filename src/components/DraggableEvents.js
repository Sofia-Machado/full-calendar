import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAddDragItem } from '../hooks/eventHook';
import { Card, CardContent, Typography } from '@mui/material';

const DraggableEvents = ({events, calendar, removeDraggableEvents, startDate, endDate, addNewEvent}) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const now = dayjs().format();
  
  const fecthDraggableItems = () => {
    return axios.get("http://localhost:8080/dragItemList")
  }
  const { mutate: addDragItem } = useAddDragItem();
  const queryClient = useQueryClient();

  /* fetch */
  const { isLoading, data: draggableList, isError, error } = useQuery('dragItems', fecthDraggableItems, {
    onSuccess: (data) => {
      events.data.forEach(event => {
        if (!data.data.includes(event.id)) {
          if (event?.extendedProps?.mandatory && now > event.end) {
            addDragItem({
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
            })
          }
        }
      })
    }
  })
 
  const handleItemClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedItemId === item.id) {
      setSelectedItemId(null); // deselect item if already selected
    } else {
      setSelectedItemId(item.id); // select item
    };
    if (e.detail === 2) {
      const category = item.extendedProps.category;
      const mandatory = item.extendedProps.mandatory;
      let backColor = '#3788d8';
      if(category === 'Santé') {
        backColor = '#e3ab9a'
      } else if ((category === 'Vie')) {
        backColor = '#44936c'
      };
      console.log(item);
      addNewEvent(calendar.current.calendar.addEvent({
          title: item.title,
          start: now,
          end: dayjs().add(15, 'minutes').format(),
          extendedProps: {
              category: category,
              mandatory: mandatory,
              resourceEditable: true,
          },
          backgroundColor: backColor,
          borderColor: backColor,
          editable: !mandatory,
          startEditable: !mandatory,
          durationEditable: !mandatory
      }));
      removeDraggableEvents(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries('dragItems');
        }
      })
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
          <Card className="draggable-card" sx={{borderRadius: 20}} key={index} >
            <CardContent
            data-event={JSON.stringify(item)}
            className={`draggable-item ${isSelected ? 'selected' : ''}`}
            draggable={true}
            onClick={(e) => handleItemClick(e, item)}
            >
              <Typography fontSize={14} component="div">
                {item.title}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </ul>
  );
};

export default DraggableEvents;