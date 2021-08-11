import { Controller, Post, Param, Req } from '@nestjs/common';
import { ActionService } from './action.service';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AuthGuard } from 'primebrick-sdk/nest';

@Controller('api/action')
@UseGuards(AuthGuard)
export class ActionController {
    constructor(private readonly actionService: ActionService) {}

    @Post(':action')
    async callAction(@Param('action') actionName: string, @Req() req: Request): Promise<any> {
        const response = await this.actionService.sendMessage(actionName, req.body);
        return response.data;
    }
}
