import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { User } from '../src/users/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../src/users/users.service';
import { Repository } from 'typeorm';

describe('UserController test', () => {
    let app: INestApplication;
    let service: UsersService;
    let repository: Repository<User>;

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 4444,
                    username: 'postgres',
                    password: 'postgres',
                    database: 'test_db',
                    entities: [User],
                    synchronize: true
                }),
                AppModule],
        }).overrideProvider(HttpService)
            .useValue({
                get: () => {
                    return of({
                        data: {
                            result: {
                                rate: 1,
                            }
                        },
                        headers: { 'user-agent': 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (HTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36' },
                        config: { url: '' },
                        status: 200,
                        statusText: '',
                    } as any)
                }
            })
            .compile();

        service = moduleFixture.get<UsersService>(UsersService);
        repository = moduleFixture.get(getRepositoryToken(User));

        app = moduleFixture.createNestApplication();
        await app.init();

        await repository.clear()
    });

    afterEach(async () => {
        await app.close();
    })


    it('/users/fxrate (GET) - Return back the correct exchange rate', async () => {

        const response = await request(app.getHttpServer())
            .get("/users/fxrate?currencyTo=EUR&currencyFrom=USD&amount=24.22")
            .expect(200)
        console.log(response.body.rate)
        expect(response.body.rate).toBeDefined();
        expect(response.body.rate).toEqual({ "rate": 1 });
    }, 60000);

    it('/users/fxrate (GET) - Return back a validation error because WRONG is invalid currency', async () => {
        console.log("NEW: ")
        const response = await request(app.getHttpServer())
            .get("/users/fxrate?currencyTo=EUR&currencyFrom=WRONG&amount=24.22")
            .expect(400)
        expect(response.body.message).toEqual("Invalid Request - incorrect currency or amount");
    });

    it('/users/fxrate (GET) - Return back a validation error because amount is empty', async () => {
        const response = await request(app.getHttpServer())
            .get("/users/fxrate?currencyTo=EUR&currencyFrom=USA&amount=")
            .expect(400)
        expect(response.body.message).toEqual("Invalid Request - incorrect currency or amount");
    });

    it('If the user does not exist should be saved to the databse!', async () => {
        await request(app.getHttpServer())
            .get("/users/fxrate?currencyTo=EUR&currencyFrom=USA&amount=")
            .set("user-agent", "Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36");

        const users = await repository.find()
        expect(users.length).toEqual(1);
        expect(users[0].browser).toEqual('Chrome Mobile');
    });
});