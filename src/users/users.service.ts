import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    async saveUser(ip: string, browser: string) {
        console.log("Ip: " + ip);
        console.log("Browser: " + browser)
        const user = await this.repo.findOneBy({ ip });
        if (!user) {
            const user = this.repo.create({ ip, browser });
            return this.repo.save(user);
        }
    }

    async findUserByIp(ip: string) {
        const user = await this.repo.findOneBy({ ip });
    }

    async findUserById(id: number) {
        const user = await this.repo.findOneBy({ id });
    }
}
