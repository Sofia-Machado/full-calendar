import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAddDragItem } from '../hooks/eventHook';
import { Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import Zoom from '@mui/material/Zoom';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';

const DraggableEvents = ({addNewEvent, events, calendar, removeDraggableEvents, updateExistingEvent}) => {
  const [page, setPage] = useState(1)
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  const fecthDraggableItems = () => {
    return axios.get(`http://localhost:8080/dragItemList?_limit=7&_page=${page}`)
  }
  const { mutate: addDragItem } = useAddDragItem();
  const queryClient = useQueryClient();
  
  /* fetch */
  const { isLoading, data: draggableList, isError, error } = useQuery(
    ['dragItems', page], 
    () => fecthDraggableItems(page),{
      keepPreviousData : true})
      
    useEffect(() => {
      const now = dayjs();
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
  }, [addDragItem, draggableList, events, queryClient, updateExistingEvent])
 
  const handleItemClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedItemId === item.id) {
      setSelectedItemId(null); // deselect item if already selected
    } else {
      setSelectedItemId(item.id); // select item
    };
    if (e.detail === 2) {
      const calendarApi = calendar.current.getApi();
      let eventData;
      let classValue;
      if (item?.classNames?.includes('past') || item?.classNames?.includes('waiting-list')) {
        classValue = 'duplicate';
        eventData = calendarApi.getEventById(item.id).toPlainObject();
      } else {
        classValue = '';
        eventData = calendarApi.getEventById(item.id);
      }
      const color = eventData?.extendedProps?.category === 'Santé' ? '#e3ab9a' : '#44936c';
      removeDraggableEvents.mutate(item.id, {
        onSuccess: () => {
          queryClient.invalidateQueries('dragItems');
        }
      })

      updateExistingEvent({...eventData, classNames: 'duplicate', 
      startEditable: !eventData?.extendedProps?.mandatory,
      durationEditable: !eventData?.extendedProps?.mandatory,
      editable: !eventData?.extendedProps?.mandatory,});
      
      addNewEvent(calendar.current.calendar.addEvent({
        ...item,
        id: item.id + classValue,
        start: dayjs().format(),
        end: dayjs().add(15, 'minutes').format(),
        color
      }), {
        onSuccess: () => {
          queryClient.invalidateQueries('events');
        }
      });
      }
  };

  if (isLoading) {
    return <h2>Loading...</h2>
  }
  if (isError) {
    return <h2>{error.message}</h2>
  }
  return (
    <>
      <ul className="draggable-list">
        <div>
        <Typography variant='title' component='h2' mb={2} sx={{textAlign: 'center', fontSize: 18, fontWeight: 400}}>Évènements à venir</Typography>
        {draggableList?.data.map((item, index) => {
          const isSelected = selectedItemId === item.id;
          return (
            <Tooltip sx={{m: 0}} title={item?.classNames?.includes('past') ? "Reporter" : ''}
            TransitionComponent={Zoom} placement='left' arrow key={index}>
              <Card className="draggable-card" sx={{borderRadius: 20}} >
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
        </div>
        <div className='pagination-buttons'>
          <IconButton onClick={() =>
          {
            setPage(old => Math.max(old - 1, 1))}}
            disabled={page === 1}>
            <input hidden accept="image/*" type="file" />
            <KeyboardArrowLeftRoundedIcon />
          </IconButton>
              <span>{page}</span>
          <IconButton
          onClick={() => {
              setPage(prev => prev + 1)
          }}
          disabled={draggableList.data.length <= 7}
          >
            <input hidden accept="image/*" type="file" />
            <KeyboardArrowRightRoundedIcon />
          </IconButton>
        </div>
      </ul>
    </>
  );
};

export default DraggableEvents;