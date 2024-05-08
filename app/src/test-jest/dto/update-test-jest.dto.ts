import { PartialType } from '@nestjs/mapped-types';
import { CreateTestJestDto } from './create-test-jest.dto';

export class UpdateTestJestDto extends PartialType(CreateTestJestDto) {}
