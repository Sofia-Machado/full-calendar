import { useState } from 'react';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

const DraggableEvents = () => {
  let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
  const list = [
    {
      id: 1,
      title: 'Call Pedro',
      extendedProps: {
        category: 'Santé',
        mandatory: true,
      },
      start: todayStr + 'T16:00:00',
      end: todayStr + 'T16:15:00',
    },
    {
      id: 2,
      title: 'Call Oscar',
      extendedProps: {
        category: 'Vie',
        mandatory: true,
      },
      start: todayStr + 'T12:30:00',
      end: todayStr + 'T12:45:00',
    },
  ];

  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleItemClick = (itemId) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null); // deselect item if already selected
    } else {
      setSelectedItemId(itemId); // select item
    }
  };

  return (
    <ul>
      {list.map((item) => {
        const isSelected = selectedItemId === item.id;
        return (
          <li
            key={item.id}
            eventData={{ item }}
            className={`draggable-item${isSelected ? ' selected' : ''}`}
            draggable={true}
            onClick={() => handleItemClick(item.id)}
          >
            {item.title}
          </li>
        );
      })}
    </ul>
  );
};

export default DraggableEvents;
