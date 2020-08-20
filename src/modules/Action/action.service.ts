import { Injectable } from '@nestjs/common';
import { ProcessorManagerService } from 'primebrick-sdk';
import { Request } from 'express';

@Injectable()
export class ActionService {
  constructor(private readonly processorService: ProcessorManagerService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sendMessage(req: Request, action: string, payload: any) {
    return await this.processorService.sendMessage(req, action, payload);
  }
}
