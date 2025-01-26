import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { processChatMessage } from '@/actions/ai';

export function ChatInterface({ tripId }: { tripId: string }) {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;
    const response = await processChatMessage(tripId, {
      content: message,
      role: 'user',
    });
    setMessage('');
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="p-4 bg-sky-100">
        <CardTitle className="text-2xl flex items-center gap-2 text-sky-700">
          <Send className="h-6 w-6" />
          Chat with AI Travel Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about your trip..."
            className="flex-grow bg-white border-sky-300 text-slate-800 placeholder-slate-400 text-lg py-6"
          />
          <Button
            onClick={handleSend}
            size="lg"
            className="bg-sky-600 text-white hover:bg-sky-700 px-6"
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
