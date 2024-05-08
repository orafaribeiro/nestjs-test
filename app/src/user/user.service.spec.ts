import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from './../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;

  let fakePrismaService: PrismaService = {} as unknown as PrismaService;

  beforeAll(() => {

    process.env = Object.assign(process.env, { DATABASE_URL: "mysql://usuario:123456@localhost:81/banco" });

  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: fakePrismaService,
        },
      ],
    }).compile();

    fakePrismaService = {
      users: {
        create: ((args) => {
          // console.log({ args })
          return Promise.resolve({
            id: 1,
            ...args.data,
          });
        }),
        findMany: (() => {
          return Promise.resolve([{
            id: 1,
            name: 'Rafael',
            email: 'rafa@hcode.com.br',
            password: 'password',
          }])
        }),
        findUnique: (({
          where
        }: {
          where: {
            id: number
          }
        }) => {

          const { id } = where;

          if (id !== 1) {
            return Promise.resolve(null);
          }

          return Promise.resolve({
            id,
            name: 'Rafael',
            email: 'rafa@hcode.com.br',
            password: 'password',
          })

        }),
        update: (() => { }) as any,
        delete: (() => { }) as any,
      },
    } as unknown as PrismaService;

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with passed arguments', async () => {

    const name = 'Teste';
    const email = 'testing';
    const password = 'teste123';

    const newUser = await service.create({
      name,
      email,
      password,
    });

    expect(newUser.id).toEqual(1);
    expect(newUser.name).toEqual(name);
    expect(newUser.email).toEqual(email);
    expect(newUser.password).toEqual(password);

  });

  it('should return a list of users', async () => {

    const users = await service.findAll();

    // expect(users.length).toEqual(1);
    expect(users).toHaveLength(1);

  });

  it('should return a single user based on id', async () => {

    const user = await service.findOne(1);

    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.password).toBeDefined();

  })

  it('should throw an error when incorrect id is provided', (done) => {

    service.findOne(2)
      .then(() => { })
      .catch((err) => {

        expect(err).toHaveProperty('response');
        expect(err).toHaveProperty('status');
        expect(err.status).toEqual(404);
        done();

      })

    /*try {

    } catch (err) {
      console.log({
        err,
      })
      expect(err).toHaveProperty('response');
      expect(err).toHaveProperty('status');
      expect(err.status).toEqual(404);
      done();
    }*/

  })

  it('should throw an exception when user is not found', (done) => {

    /*fakePrismaService = {
      users: {
        ...fakePrismaService.users,
        findUnique: (() => {
          return Promise.resolve(null);
        }),
      }
    } as unknown as PrismaService;*/

    const user = service.findOne(4)
      .then()
      .catch((err) => {

        expect(err).toHaveProperty('response');
        expect(err).toHaveProperty('status');
        expect(err.status).toEqual(404);
        done();
      });

    /*try {
      service.findOne(2);
    } catch (err) {
      expect(err).toHaveProperty('response');
      expect(err).toHaveProperty('status');
      expect(err.status).toEqual(404);
      done();
    }*/

  })

});
