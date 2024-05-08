import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestJestService } from './test-jest.service';
import { CreateTestJestDto } from './dto/create-test-jest.dto';
import { UpdateTestJestDto } from './dto/update-test-jest.dto';

@Controller('test-jest')
export class TestJestController {
  constructor(private readonly testJestService: TestJestService) {}

  @Post()
  create(@Body() createTestJestDto: CreateTestJestDto) {
    return this.testJestService.create(createTestJestDto);
  }

  @Get()
  findAll() {
    return this.testJestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testJestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestJestDto: UpdateTestJestDto) {
    return this.testJestService.update(+id, updateTestJestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testJestService.remove(+id);
  }
}
