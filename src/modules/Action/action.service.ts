import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MessagePayload } from 'primebrick-sdk/models';
import { ProcessorManagerService } from 'primebrick-sdk/modules';

@Injectable()
export class ActionService {
    constructor(private readonly processorService: ProcessorManagerService) {}

    async sendMessage(action: string, payload: unknown): Promise<MessagePayload<any>> {
        try {
            return await this.processorService.sendMessage<unknown, unknown>(action, payload);
        } catch (ex) {
            new InternalServerErrorException(ex);
        }
    }
}
