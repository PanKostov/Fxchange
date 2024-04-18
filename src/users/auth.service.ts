import { validate } from "class-validator";
import { UsersService } from "./users.service";
import { Injectable, Ip, Req } from "@nestjs/common";
import { UserDto } from "./dtos/user.dto";
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector();

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUserData(ip: string, req: { headers: Record<string, string> }): Promise<{ error?: string, success: boolean }> {
        const ua = req.headers['user-agent'], $ = {};
        if (!ua) {
            console.log("Did not find user-agent!")
            return { success: false, error: 'Did not find user-agent!' }
        }

        const browser = detector.detect(ua);
        const userDto = new UserDto();
        userDto.ip = ip;
        userDto.browser = browser.client.name;

        return this.validateUserDetailsAndPersist(userDto);
    }

    private async validateUserDetailsAndPersist(userDto: UserDto) {
        const errors = await validate(userDto)

        if (errors.length > 0) {
            console.log(`User's data was not saved due to errors ${JSON.stringify(errors)}`)
            return { success: false, error: "User's data was not saved!" }
        }

        else {
            console.log("Calling saveUser method!")
            this.usersService.saveUser(userDto.ip, userDto.browser);
            return { success: true }
        }
    }
}
