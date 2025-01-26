import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User } from 'lucide-react';
import { processChatMessage } from '@/actions/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

type Message = {
  content: string;
  role: 'USER' | 'ASSISTANT';
  timestamp: Date;
};

export function ChatInterface({ tripId }: { tripId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const newMessage = {
      content: message,
      role: 'USER' as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await processChatMessage(tripId, [newMessage]);

      if (response.data) {
        setMessages((prev) => [
          ...prev,
          {
            content: response.data,
            role: 'ASSISTANT',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="p-4 bg-sky-100">
        <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
          <Bot className="h-6 w-6" />
          Chat with AI Travel Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                  flex gap-2 items-start max-w-[80%]
                  ${msg.role === 'USER' ? 'flex-row-reverse' : ''}
                `}
                >
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${msg.role === 'USER' ? 'bg-sky-600' : 'bg-slate-600'}
                  `}
                  >
                    {msg.role === 'USER' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`
                    rounded-lg p-3
                    ${
                      msg.role === 'USER'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }
                  `}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {format(msg.timestamp, 'HH:mm')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-100 rounded-lg p-3 flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your trip..."
            className="flex-grow bg-white border-sky-300 text-slate-800 placeholder-slate-400 text-lg py-6"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            size="lg"
            className="bg-sky-600 text-white hover:bg-sky-700 px-6"
            disabled={isLoading}
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
