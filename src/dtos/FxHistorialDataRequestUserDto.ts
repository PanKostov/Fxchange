import { HttpException, Injectable } from '@nestjs/common';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { validate } from 'class-validator';



@Injectable()
export class FxHistoricalDataRequestUserDto {

    // private body = new FxHistoricalDataRequestUserDto();

    // constructor() { this.body = new FxHistoricalDataRequestUserDto() }

    //@IsDate()
    date: Date
    @IsString()
    @IsNotEmpty()
    symbols: string;
    @IsNotEmpty()
    @IsString()
    base: string;

    static fromRequest(date: Date, symbols: string, base: string): FxHistoricalDataRequestUserDto {
        const body = new FxHistoricalDataRequestUserDto();
        body.date = date;
        body.symbols = symbols;
        body.base = base;

        return body;
    }

    // async validateRequest(date: Date, symbols: string, base: string): Promise<FxHistoricalDataRequestUserDto> {

    //     const query: FxHistoricalDataRequestUserDto = this.fromRequest(date, symbols, base);
    //     //const errors = await validate(query)

    //     // if (errors.length) {
    //     //     console.log("Error DTO: ")
    //     //     console.log(errors[0].constraints);
    //     //     throw new HttpException('Invalid Request - wrong date', 400);
    //     // }

    //     return query;
    // }
}