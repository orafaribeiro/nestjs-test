import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from './../prisma/prisma.service';

describe('UserController', () => {
  let controller: UserController;

  const fakeUserService: UserService = {
    create: () => { },
    findAll: () => { },
    findOne: () => { },
    update: () => { },
    remove: () => { },
  } as unknown as UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
