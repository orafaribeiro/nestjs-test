import { Test, TestingModule } from '@nestjs/testing';
import { TestJestService } from './test-jest.service';

function multiplyNumber(x: number, y: number) {

  x = Number(x);
  y = Number(y);

  if (isNaN(x)) {
    return {
      message: 'Number invalid',
    }
  }

  if (isNaN(y)) {
    return {
      message: 'Number invalid',
    }
  }

  return x * y;

}

function splitString(myString: string) {

  return myString.split('');

}

describe('TestJestService', () => {
  let service: TestJestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestJestService],
    }).compile();

    service = module.get<TestJestService>(TestJestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('multiply function', () => {

    it('should multiply a number', () => {

      const result = multiplyNumber(8, 10);

      expect(result).toBe(80);

    });

    it('should multiply a number even when string', () => {

      const result = multiplyNumber('5' as unknown as number, '10' as unknown as number);

      expect(result).toBe(50);

    });

    it('should return an error if number is invalid', () => {

      const result = multiplyNumber('abc' as unknown as number, '10' as unknown as number);

      expect(result).toHaveProperty('message', 'Number invalid');

    });

  });

  it('should split string', () => {

    const value = 'nestjs';

    const result = splitString(value);

    expect(result).toEqual(['n', 'e', 's', 't', 'j', 's']);

  });
});
