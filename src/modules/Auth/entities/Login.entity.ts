/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { AudibleEntity } from 'primebrick-sdk';

@Entity()
export class Login extends AudibleEntity {
    @Column({ unique: true })
    username: string;

    @Column()
    password: string; //TODO: @mso-> save hashed password

    @OneToOne(
        type => User,
        T => T.login,
    )
    @JoinColumn()
    user: User;
}
