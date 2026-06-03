import { Test, TestingModule } from '@nestjs/testing';
import { TaunterServiceController } from './taunter-service.controller';
import { TaunterServiceService } from './taunter-service.service';

describe('TaunterServiceController', () => {
  let taunterServiceController: TaunterServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaunterServiceController],
      providers: [TaunterServiceService],
    }).compile();

    taunterServiceController = app.get<TaunterServiceController>(TaunterServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(taunterServiceController.getHello()).toBe('Hello World!');
    });
  });
});
