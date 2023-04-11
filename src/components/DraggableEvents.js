import { useState } from 'react';

const DraggableEvents = () => {
  const list = [
    {
      title: 'Call Pedro',
      extendedProps: {
        category: 'Santé',
        mandatory: true,
      },
    },
    {
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
    <ul>
      {list.map((item) => {
        const isSelected = selectedItemId === item.id;
        return (
          <li
            key={item.id}
            eventData={item}
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
