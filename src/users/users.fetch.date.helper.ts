import { HttpException, Injectable } from "@nestjs/common";
import { UsersMiddlewareFetch } from "./users.middleware.fetch";
import { FxHistoricalDataRequest, FxHistoricalDataRequestUserDto } from "../dtos";
const moment = require('moment');


@Injectable()
export class UsersFetchDateHelper {

    constructor(
        private userMiddlewareTech: UsersMiddlewareFetch,
        //private fxHistoricalDataRequestUserDto: FxHistoricalDataRequestUserDto
    ) { }

    async fetchDates(dateFrom: string, dateTo: string, symbols: string, base: string): Promise<FxHistoricalDataRequest[]> {
        symbols = symbols.split(', ').join("%2C%20");
        const dates = this.stringToDates(dateFrom, dateTo);
        let currentDate: Date = dates.dateFrom;

        let promises: Promise<FxHistoricalDataRequest>[] = [];
        while (currentDate < dates.dateTo) {
            currentDate = moment(currentDate, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD');
            let query: FxHistoricalDataRequest = FxHistoricalDataRequestUserDto.fromRequest(currentDate, symbols, base);
            promises.push(this.userMiddlewareTech.fetchFxHistoricalData(query));
        }

        return Promise.all(promises);
    }

    stringToDates(dateFrom: string, dateTo: string): { 'dateFrom': Date, 'dateTo': Date } {
        const dateFromDate: Date = moment(dateFrom).format('YYYY-MM-DD');
        const dateToDate: Date = moment(dateTo).format('YYYY-MM-DD');
        this.validateDates(dateFromDate, dateToDate);

        return {
            'dateFrom': dateFromDate,
            'dateTo': dateToDate
        }
    }

    validateDates(dateFrom: Date, dateTo: Date) {
        if (dateTo <= dateFrom) {
            throw new HttpException("dateTo must be less than dateFrom", 400);
        }

    }

}