import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ProcessorManagerModule } from 'primebrick-sdk/modules';
import { ActionController } from './action.secure.controller';

@Module({
    imports: [ProcessorManagerModule],
    controllers: [ActionController],
    providers: [ActionService],
})
export class ActionModule {}
