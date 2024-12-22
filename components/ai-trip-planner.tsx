'use client'

import { useState } from 'react'
import { Send, Bot } from 'lucide-react'

export function AiTripPlanner({ onPlanGenerated }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI trip planner. How can I assist you with your travel plans?", sender: "ai" }
  ])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: Date.now(), text: input, sender: "user" }
      setMessages(prev => [...prev, userMessage])
      setInput('')

      // Simulate AI response (replace with actual AI integration)
      const aiResponse = { id: Date.now() + 1, text: "I'm processing your request. Here's a suggested plan based on your input...", sender: "ai" }
      setMessages(prev => [...prev, aiResponse])

      // Simulate generating a plan (replace with actual AI-generated plan)
      const generatedPlan = {
        destinations: ['Paris', 'Rome', 'Barcelona'],
        duration: 10,
        travelers: 2,
        elements: [
          // Add mock elements here
        ]
      }

      onPlanGenerated(generatedPlan)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Trip Planner</h2>
      <div className="h-80 overflow-y-auto mb-4 p-2 bg-gray-50 rounded">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded ${
              message.sender === 'user' ? 'bg-amber-100 ml-auto' : 'bg-gray-200'
            } max-w-[80%]`}
          >
            {message.sender === 'ai' && <Bot className="h-4 w-4 inline-block mr-2" />}
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your travel plans..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-amber-500 focus:border-amber-500"
        />
        <button
          onClick={handleSend}
          className="bg-amber-500 text-white px-4 py-2 rounded-r-md hover:bg-amber-600 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

