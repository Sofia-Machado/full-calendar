import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { dragList } from '../data/eventData';

const DraggableEvents = () => {
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleItemClick = (itemId) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null); // deselect item if already selected
    } else {
      setSelectedItemId(itemId); // select item
    }
  };

  return (
    <ul className="draggable-list">
      {dragList.map((item, index) => {
        const isSelected = selectedItemId === item.id;
        return (
          <Card sx={{ minWidth: 120 }} key={index}>
            <CardContent
            key={index}
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
