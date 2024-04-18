import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersMiddlewareFetch } from './users.middleware.fetch';
import { FxHistoricalDataRequestUserDto } from '../dtos';
import { UsersFetchDateHelper } from './users.fetch.date.helper';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, UsersMiddlewareFetch, UsersFetchDateHelper, FxHistoricalDataRequestUserDto]
})
export class UsersModule { }
