import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { ProcessorManagerModule } from 'primebrick-sdk';

@Module({
  imports: [ProcessorManagerModule],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
