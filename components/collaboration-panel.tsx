'use client';

import { useState } from 'react';
import { Users, MessageSquare, Share2 } from 'lucide-react';

export function CollaborationPanel({ tripId }: { tripId: string }) {
  console.log(tripId);
  const [collaborators] = useState([
    { id: 1, name: 'You', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 2, name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'John Doe', text: 'How about we add a museum visit?' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: 'You', text: newMessage },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Collaboration</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Collaborators
        </h3>
        <div className="flex space-x-2">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex flex-col items-center">
              <img
                src={collaborator.avatar}
                alt={collaborator.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm mt-1">{collaborator.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Chat
        </h3>
        <div className="h-40 overflow-y-auto mb-2 border border-gray-200 rounded p-2">
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <span className="font-semibold">{message.sender}: </span>
              <span>{message.text}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-4 py-2 rounded-r-md hover:bg-amber-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Share2 className="h-5 w-5 mr-2" />
          Invite
        </h3>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter email address"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-amber-500 focus:border-amber-500"
          />
          <button className="bg-amber-500 text-white px-4 py-2 rounded-r-md hover:bg-amber-600 transition-colors">
            Invite
          </button>
        </div>
      </div>
    </div>
  );
}
