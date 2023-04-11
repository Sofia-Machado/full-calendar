import { useState } from 'react';

const DraggableEvents = () => {
  const list = [
    {
      id: 3,
      title: 'Call Pedro',
      extendedProps: {
        category: 'Santé',
        mandatory: true,
      },
      
    },
    {
      id: 4,
      title: 'Call Oscar',
      extendedProps: {
        category: 'Vie',
        mandatory: true,
      },
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
    <ul className="draggable-list">
      {list.map((item) => {
        const isSelected = selectedItemId === item.id;
        return (
          <li
            key={item.id}
            data-event={JSON.stringify(item)}
            className={`draggable-item ${isSelected ? 'selected' : ''}`}
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
