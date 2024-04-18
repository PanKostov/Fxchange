import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('request_stats')
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'user_id',
    })
    id: number;

    @Column({
        nullable: false,
        default: '',
    })
    ip: string;

    @Column({
        nullable: false,
        default: '',
    })
    browser: string;
}
