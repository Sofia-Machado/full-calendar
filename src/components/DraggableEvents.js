import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

const fecthDraggableItems = () => {
  return axios.get("http://localhost:8001/dragItemList")
}

const DraggableEvents = ({events}) => {
  const [selectedItemId, setSelectedItemId] = useState(null);

  /* fetch */
  const { isLoading, data: draggableList, isError, error } = useQuery('dragItems', fecthDraggableItems)
 
  const handleItemClick = (itemId) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null); // deselect item if already selected
    } else {
      setSelectedItemId(itemId); // select item
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
      {draggableList?.data.map((item, index) => {
        const isSelected = selectedItemId === item.id;
        return (
          <Card sx={{ minWidth: 120 }} key={index} >
            <CardContent
            data-event={JSON.stringify(item)}
            className={`draggable-item ${isSelected ? 'selected' : ''}`}
            draggable={true}
            onClick={() => handleItemClick(item.id)}
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