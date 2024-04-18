import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UsersService } from "../users.service";
var httpMocks = require('node-mocks-http');

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        fakeUsersService = {
            saveUser: (ip: string, browser: string) => Promise.resolve({ id: 1, ip, browser })
        };
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);

    });

    it('can create  an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('An error Did not find user-agent should be rised', async () => {
        const result = await service.validateUserData("fakeIp", { headers: {} });

        expect(result.error).toEqual("Did not find user-agent!");
        expect(result.success).toEqual(false);
    });

    it('The saveUser method should be called and success true to be returned', async () => {
        let req = { "headers": { 'user-agent': 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36' } };
        const result = await service.validateUserData("192.0.2.1", req);
        expect(result.success).toEqual(true);
    });

    it('An error should be raised!', async () => {
        let req = { "headers": { 'user-agent': 'ok' } };
        const result = await service.validateUserData("fakeIp", req);
        expect(result.error).toEqual("User's data was not saved!");
    });

});
