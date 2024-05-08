import { Module } from '@nestjs/common';
import { TestJestService } from './test-jest.service';
import { TestJestController } from './test-jest.controller';

@Module({
  controllers: [TestJestController],
  providers: [TestJestService],
})
export class TestJestModule {}
