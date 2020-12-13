import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MessagePayload, ProcessorManagerService } from 'primebrick-sdk';

@Injectable()
export class ActionService {
    constructor(private readonly processorService: ProcessorManagerService) {}

    async sendMessage(action: string, payload: any): Promise<MessagePayload<any>> {
        try {
            return await this.processorService.sendMessage<any, any>(action, payload);
        } catch (ex) {
            new InternalServerErrorException(ex);
        }
    }
}
