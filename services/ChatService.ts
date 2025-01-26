import { db } from '@/lib/db';
import { ChatMessageInput, ChatMessageSchema } from '@/schemas/trip';
import { processChatMessage } from '@/actions/ai';
import { z } from 'zod';

export class ChatService {
  async verifyTripOwnership(tripId: string, userId: string): Promise<boolean> {
    const trip = await db.trip.findFirst({
      where: {
        id: tripId,
        userId: userId,
      },
    });
    return !!trip;
  }

  async processMessage(tripId: string, message: ChatMessageInput) {
    // Create new chat session if none exists
    const session =
      (await db.chatSession.findFirst({
        where: { tripId },
        orderBy: { createdAt: 'desc' },
        include: { messages: true },
      })) ||
      (await db.chatSession.create({
        data: { tripId },
        include: { messages: true },
      }));

    // Save user message
    const userMessage: z.infer<typeof ChatMessageSchema> =
      await db.chatMessage.create({
        data: {
          sessionId: session.id,
          content: message.content,
          role: message.role,
        },
      });

    // Get all messages for context
    const messages = [...session.messages, userMessage].map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response
    const aiResponse = await processChatMessage(tripId, messages);

    // Save AI response
    const assistantMessage = await db.chatMessage.create({
      data: {
        sessionId: session.id,
        content: aiResponse.data,
        role: 'ASSISTANT',
      },
    });

    return {
      userMessage,
      assistantMessage,
    };
  }

  async getChatHistory(tripId: string) {
    return db.chatSession.findMany({
      where: { tripId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteChat(sessionId: string) {
    return db.chatSession.delete({
      where: { id: sessionId },
    });
  }
}

export const chatService = new ChatService();
