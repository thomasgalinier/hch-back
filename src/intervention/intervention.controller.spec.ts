import { Test, TestingModule } from '@nestjs/testing';
import { InterventionController } from './intervention.controller';

describe('InterventionController', () => {
  let controller: InterventionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterventionController],
    }).compile();

    controller = module.get<InterventionController>(InterventionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
