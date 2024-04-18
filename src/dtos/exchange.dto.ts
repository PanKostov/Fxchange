import { IsString, IsNotEmpty, IsNumberString, Length } from 'class-validator';
import { FxConversionRequest } from './FxConversionRequest';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common';

export class ExchangeDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 3)
    currencyFrom: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 3)
    currencyTo: string;

    @IsString()
    @IsNotEmpty()
    @IsNumberString()
    amount: string;

    static fromRequest(request: FxConversionRequest): ExchangeDto {
        const body = new ExchangeDto();
        body.currencyTo = request.currencyTo;
        body.currencyFrom = request.currencyFrom;
        body.amount = request.amount;

        return body
    }

    static async validateRequest(request: FxConversionRequest) {
        const errors = await validate(ExchangeDto.fromRequest(request))

        if (errors.length) {
            console.log("Error DTO: ")
            console.log(errors[0].constraints);
            throw new HttpException('Invalid Request - incorrect currency or amount', 400);
        }
    }
}