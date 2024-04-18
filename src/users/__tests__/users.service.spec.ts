import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';


describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('aws', () => {
    service.saveUser("ip", "browser");

  })
});
