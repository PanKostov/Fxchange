import {IsString, IsNotEmpty, IsIP} from 'class-validator';

export class UserDto {
    @IsIP()
    ip: string;

    @IsString()
    @IsNotEmpty()
    browser: string;
}