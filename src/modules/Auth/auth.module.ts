import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LogManagerService, ProcessorManagerModule, ProcessorManagerService, TenantManagerModule } from 'primebrick-sdk/modules';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        TenantManagerModule,
        ProcessorManagerModule,
        ClientsModule.register([
            {
                name: 'PRIMEBRICK_SERVICE',
                transport: Transport.NATS,
                options: { url: process.env.NATS_URL || 'nats://localhost:4222' },
            },
        ]),
        LogManagerService,
    ],
    controllers: [AuthController],
    providers: [ProcessorManagerService],
    exports: [],
})
export class AuthModule {}
