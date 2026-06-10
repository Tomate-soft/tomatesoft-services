import { Test, TestingModule } from '@nestjs/testing';
import { RecoveryEventServiceController } from './recovery-event-service.controller';
import { RecoveryEventServiceService } from './recovery-event-service.service';

describe('RecoveryEventServiceController', () => {
  let recoveryEventServiceController: RecoveryEventServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RecoveryEventServiceController],
      providers: [RecoveryEventServiceService],
    }).compile();

    recoveryEventServiceController = app.get<RecoveryEventServiceController>(
      RecoveryEventServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(recoveryEventServiceController.getHello()).toBe('Hello World!');
    });
  });
});
