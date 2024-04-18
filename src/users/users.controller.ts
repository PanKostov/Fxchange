import { Controller, Get, Ip, Req, UseInterceptors, CacheTTL, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FxConversionRequest, ExchangeDto, } from '../dtos';
import { UsersMiddlewareFetch } from './users.middleware.fetch';
import { UsersFetchDateHelper } from './users.fetch.date.helper';

@Controller('users')
export class UsersController {

    constructor(
        private authService: AuthService,
        private userMiddlewareTech: UsersMiddlewareFetch,
        private userFetchDateHelper: UsersFetchDateHelper
    ) { }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @Get('/fxrate')
    async getFxRate(@Query() query: FxConversionRequest, @Ip() ip: string, @Req() req): Promise<{ rate: number }> {
        await this.authService.validateUserData(ip, req);
        await ExchangeDto.validateRequest(query);
        const result = await this.userMiddlewareTech.fetchFxCurrency(query);
        return { rate: result };
    }


    @Get('/history')
    async getFxHistoricalData(@Query('dateFrom') dateFrom: string, @Query('dateTo') dateTo, @Query('symbols') symbols, @Query('base') base,): Promise<any> {
        const historicalFx = await this.userFetchDateHelper.fetchDates(dateFrom, dateTo, symbols, base)
        return historicalFx;
    }
}
