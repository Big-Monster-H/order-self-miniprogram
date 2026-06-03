import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private service: ChatService) {}

  @Get('sessions')
  getSessions(@CurrentUser() user: any) {
    return this.service.getSessions(user.id);
  }

  @Post('sessions')
  createSession(@CurrentUser() user: any, @Body() body: { target_id: number; order_id?: number }) {
    return this.service.getOrCreateSession(user.id, body.target_id, body.order_id);
  }

  @Get('messages/:sessionId')
  getMessages(@Param('sessionId') id: string, @Query('page') page?: string) {
    return this.service.getMessages(+id, page ? +page : 1);
  }

  @Post('messages/:sessionId')
  sendMessage(
    @CurrentUser() user: any,
    @Param('sessionId') id: string,
    @Body() body: { content: string; receiver_id: number },
  ) {
    return this.service.sendMessage(+id, user.id, body.receiver_id, body.content);
  }

  @Post('read/:sessionId')
  markRead(@CurrentUser() user: any, @Param('sessionId') id: string) {
    return this.service.markRead(+id, user.id);
  }
}