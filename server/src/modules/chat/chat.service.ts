import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImSession } from './im-session.entity';
import { ImMessage, MessageType } from './im-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ImSession) private sessionRepo: Repository<ImSession>,
    @InjectRepository(ImMessage) private msgRepo: Repository<ImMessage>,
  ) {}

  async getOrCreateSession(userId: number, targetId: number, orderId?: number) {
    const existing = await this.sessionRepo.findOne({
      where: [
        { user_id: userId, target_id: targetId },
        { user_id: targetId, target_id: userId },
      ],
    });

    if (existing) return existing;

    const session = this.sessionRepo.create({
      user_id: userId,
      target_id: targetId,
      order_id: orderId || 0,
    } as any);
    return this.sessionRepo.save(session);
  }

  async getSessions(userId: number) {
    return this.sessionRepo
      .createQueryBuilder('s')
      .where('s.user_id = :uid OR s.target_id = :uid', { uid: userId })
      .orderBy('s.last_message_at', 'DESC', 'NULLS LAST')
      .getMany();
  }

  async getMessages(sessionId: number, page = 1, pageSize = 30) {
    const [list, total] = await this.msgRepo.findAndCount({
      where: { session_id: sessionId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list: list.reverse(), total, page, pageSize };
  }

  async sendMessage(sessionId: number, senderId: number, receiverId: number, content: string, type: MessageType = MessageType.TEXT) {
    const msg = this.msgRepo.create({ session_id: sessionId, sender_id: senderId, receiver_id: receiverId, content, type } as any);
    await this.msgRepo.save(msg);
    await this.sessionRepo.update(sessionId, { last_message: content.slice(0, 100), last_message_at: new Date() } as any);
    return msg;
  }

  async markRead(sessionId: number, userId: number) {
    await this.msgRepo.update({ session_id: sessionId, receiver_id: userId, is_read: 0 }, { is_read: 1 });
  }
}