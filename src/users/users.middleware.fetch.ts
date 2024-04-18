import { FxConversionRequest, FxHistoricalDataRequest } from "../dtos";
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { HttpException, Injectable } from "@nestjs/common";
import { FxHistoricalDataDto } from "./dtos/fx.historical.data.dto";

@Injectable()
export class UsersMiddlewareFetch {
    constructor(
        public httpService: HttpService
    ) { }

    private async fetch<T>(url: string): Promise<T> {
        console.log("FETCHING: ")
        const { data } = await firstValueFrom(
            this.httpService
                .get<T>(url)
                .pipe(
                    tap(foo => {
                        //console.log(foo)
                    }),
                    catchError((error: AxiosError) => {
                        console.log("Fetch error: ", error);
                        throw new HttpException('Invalid Request', 400);
                    }),
                ),
        );

        return data;
    }

    async fetchFxHistoricalData(query: FxHistoricalDataRequest): Promise<FxHistoricalDataRequest> {
        let url = `https://api.apilayer.com/exchangerates_data/${query.date}?symbols=${query.symbols}&base=${query.base}&apikey=0VbX6UWiy3nKxeMe486zHsnktYArwMid`;
        console.log("URL: ", url);
        const data = await this.fetch<FxHistoricalDataRequest>(url);
        return data;

    }

    async fetchFxCurrency(query: FxConversionRequest): Promise<number> {
        let url = `https://api.apilayer.com/exchangerates_data/convert?to=${query.currencyTo}&from=${query.currencyFrom}&amount=${query.amount}&apikey=0VbX6UWiy3nKxeMe486zHsnktYArwMid`
        const data = await this.fetch<{ result: number }>(url);
        return data.result;
    }

}