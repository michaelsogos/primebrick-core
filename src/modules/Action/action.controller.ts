import { Controller, Post, Param, Req } from '@nestjs/common';
import { ActionService } from './action.service';
import { Request } from 'express';

@Controller('api/action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post(':action')
  async callAction(
    @Param('action') actionName: string,
    @Req() req: Request,
  ): Promise<any> {
    return await this.actionService.sendMessage(req, actionName, req.body);
  }
}
