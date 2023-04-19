import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAddDragItem } from '../hooks/eventHook';
import { Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import Zoom from '@mui/material/Zoom';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { previousDay } from 'date-fns';

const DraggableEvents = ({addNewEvent, events, calendar, removeDraggableEvents, updateExistingEvent}) => {
  const [page, setPage] = useState(0)
  const [selectedItemId, setSelectedItemId] = useState(null);
  const now = dayjs().format();
  
  const fecthDraggableItems = () => {
    return axios.get(`http://localhost:8080/dragItemList?_limit=7_page=${page}`)
  }
  const { mutate: addDragItem } = useAddDragItem();
  const queryClient = useQueryClient();

//https://tanstack.com/query/v4/docs/react/guides/paginated-queries
  /* fetch */
  const { isLoading, isFetching, data: draggableList, isPreviousData, isError, error } = useQuery(
    ['dragItems', page], 
  () => fecthDraggableItems(page),{
  keepPreviousData : true})

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
console.log(isPreviousData, ' ', draggableList)
  return (
    <>
      <ul className="draggable-list">
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
        <div className='pagination-buttons'>
          <IconButton onClick={() =>
          {
            console.log('click')
            setPage(old => Math.max(old - 1, 0))}}
            disabled={page === 0}>
            <input hidden accept="image/*" type="file" />
            <KeyboardArrowLeftRoundedIcon />
          </IconButton>
              <span>{page + 1}</span>
          <IconButton
          onClick={() => {
            console.log('click')
            if (!isPreviousData && draggableList.data.length > 7) {
              setPage(prev => prev + 1)
            }
          }}
          disabled={isPreviousData || !draggableList.data.length > 7}
          >
            <input hidden accept="image/*" type="file" />
            <KeyboardArrowRightRoundedIcon />
          </IconButton>
          {isFetching ? <span> Loading...</span> : null}{' '}
        </div>
      </ul>
    </>
  );
};

export default DraggableEvents;