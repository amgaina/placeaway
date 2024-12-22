'use client'

import { useState } from 'react'
import { Send, X } from 'lucide-react'

export function ChatInterface({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you modify your trip?", sender: "ai" }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, sender: "user" }])
      setInput('')
      // Here you would typically send the message to your AI backend and handle the response
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chat with AI Assistant</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="h-80 overflow-y-auto mb-4 p-2 bg-gray-50 rounded">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded ${
                message.sender === 'user' ? 'bg-amber-100 ml-auto' : 'bg-gray-200'
              } max-w-[80%]`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-teal-500 focus:border-teal-500"
          />
          <button
            onClick={handleSend}
            className="bg-amber-500 text-white px-4 py-2 rounded-r-md hover:bg-amber-600 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

