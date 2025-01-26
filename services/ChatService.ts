import { db } from '@/lib/db';
import { AIService } from './AIService';
import { ChatMessageInput } from '@/schemas/trip';

export class ChatService {
  static async verifyTripOwnership(
    tripId: string,
    userId: string,
  ): Promise<boolean> {
    const trip = await db.trip.findFirst({
      where: {
        id: tripId,
        userId: userId,
      },
    });
    return !!trip;
  }

  static async processMessage(tripId: string, message: ChatMessageInput) {
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
    const userMessage = await db.chatMessage.create({
      data: {
        sessionId: session.id,
        content: message.content,
        role: message.role,
      },
    });

    // Get all messages for context
    const messages = [...session.messages, userMessage].map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Get AI response
    const aiResponse = await AIService.processChatMessage(tripId, messages);

    // Save AI response
    const assistantMessage = await db.chatMessage.create({
      data: {
        sessionId: session.id,
        content: aiResponse,
        role: 'assistant',
      },
    });

    return {
      userMessage,
      assistantMessage,
    };
  }

  static async getChatHistory(tripId: string) {
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

  static async deleteChat(sessionId: string) {
    return db.chatSession.delete({
      where: { id: sessionId },
    });
  }
}
