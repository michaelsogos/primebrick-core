import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AdvancedLogger, ProcessorManagerModule, ProcessorManagerService, TenantManagerModule } from 'primebrick-sdk';
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
    ],
    controllers: [AuthController],
    providers: [ProcessorManagerService, AdvancedLogger],
    exports: [],
})
export class AuthModule {}
