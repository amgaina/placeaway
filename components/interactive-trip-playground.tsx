'use client';

import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Plane, Hotel, Car, Ticket, MessageCircle } from 'lucide-react';
// import { ChatInterface } from './chat-interface';

const initialTripElements = [
  {
    id: 'flight',
    type: 'Flight',
    icon: Plane,
    details: 'Round-trip, Economy Class',
  },
  {
    id: 'hotel',
    type: 'Accommodation',
    icon: Hotel,
    details: '4-star hotel in Manhattan',
  },
  {
    id: 'transport',
    type: 'Transportation',
    icon: Car,
    details: 'Subway passes and occasional taxi',
  },
  {
    id: 'activities',
    type: 'Activities',
    icon: Ticket,
    details: 'Top-rated New York experiences',
  },
];

export function InteractiveTripPlayground() {
  const [tripElements, setTripElements] = useState(initialTripElements);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tripElements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTripElements(items);
  };

  // const handleEdit = (id) => {
  //   // Implement edit functionality
  //   console.log(`Editing element with id: ${id}`)
  // }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Your Trip Playground
      </h2>
      <p className="text-gray-600 mb-6">
        Drag and drop elements to reorder your trip, or click the edit icon to
        modify details. Use the chat interface for more complex changes.
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Draggable draggableId="draggable" index={0}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    Content
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="mt-8 flex justify-between">
        <button className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors">
          Save Changes
        </button>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Chat with AI Assistant
        </button>
      </div>
      {/* {isChatOpen && <ChatInterface onClose={() => setIsChatOpen(false)} />} */}
    </div>
  );
}
