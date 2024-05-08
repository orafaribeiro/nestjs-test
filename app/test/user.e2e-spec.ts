import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { execSync } from 'child_process';

describe('UserController (e2e)', () => {
    let app: INestApplication;

    const databaseTest = 'mysql://usuario:123456@localhost:82/banco'

    beforeAll(() => {

        process.env = Object.assign(process.env, { DATABASE_URL: databaseTest });

        execSync('npm run prisma:push', {
            env: {
                ...process.env,
                DATABASE_URL: databaseTest,
            },
        });

    })

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/user (post)', () => {
        return request(app.getHttpServer())
            .post('/user')
            .send({
                email: 'rafa@hcode.com.br',
                name: 'Rafael Ribeiro',
                password: '123456'
            })
            .expect(201)
            .then((response) => {
                expect(response).toHaveProperty("text");

                const data = JSON.parse(response.text);

                expect(data).toHaveProperty('email');
                expect(data).toHaveProperty('name');

                expect(data.email).toEqual('rafa@hcode.com.br');
                expect(data.name).toEqual('Rafael Ribeiro');

            });
    });

    it('/user (GET)', () => {
        return request(app.getHttpServer())
            .get('/user')
            .expect(200)
            .then((response) => {
                expect(response).toHaveProperty("text");
                expect(JSON.parse(response.text)).toHaveLength(1);
            });
    });

    // Tratar erro se tentar criar um usuário com email que já existe
    // Rota que lista apenas um usuário
    // Rota que atualiza um usuário
    // Rota que exclui um usuário
    // Tratar erro de excluir usuário que já não existe

    afterAll(() => {

        execSync('npm run prisma:reset', {
            env: {
                ...process.env,
                DATABASE_URL: databaseTest,
            },
        });

    })
});
