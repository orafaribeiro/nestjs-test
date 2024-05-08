import { Test, TestingModule } from '@nestjs/testing';
import { TestJestController } from './test-jest.controller';
import { TestJestService } from './test-jest.service';

describe('TestJestController', () => {
  let controller: TestJestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestJestController],
      providers: [TestJestService],
    }).compile();

    controller = module.get<TestJestController>(TestJestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
