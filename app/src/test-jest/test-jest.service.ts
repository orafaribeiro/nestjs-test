import { Injectable } from '@nestjs/common';
import { CreateTestJestDto } from './dto/create-test-jest.dto';
import { UpdateTestJestDto } from './dto/update-test-jest.dto';

@Injectable()
export class TestJestService {
  create(createTestJestDto: CreateTestJestDto) {
    return 'This action adds a new testJest';
  }

  findAll() {
    return `This action returns all testJest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testJest`;
  }

  update(id: number, updateTestJestDto: UpdateTestJestDto) {
    return `This action updates a #${id} testJest`;
  }

  remove(id: number) {
    return `This action removes a #${id} testJest`;
  }
}
