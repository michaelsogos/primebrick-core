/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { Login } from './Login.entity';
import { AudibleEntity } from 'primebrick-sdk';
import { Role } from './Role.entity';

@Entity()
export class User extends AudibleEntity {
    @Column({ unique: true })
    code: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    languageCode: string;

    @OneToOne(
        type => Login,
        T => T.user,
    )
    login: Login;

    @ManyToMany(
        type => Role,
        T => T.users,
        { eager: true },
    )
    @JoinTable()
    roles: Role[];
}
