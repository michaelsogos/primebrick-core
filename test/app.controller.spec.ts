import { Test, TestingModule } from '@nestjs/testing';
import { AppSecureController } from '../src/app.secure.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
    let appController: AppSecureController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppSecureController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppSecureController>(AppSecureController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.seedDatabase('local')).toBe('Hello World!');
        });
    });
});
