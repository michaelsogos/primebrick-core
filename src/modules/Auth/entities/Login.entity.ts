import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AudibleEntity, RegisterEntity } from 'primebrick-sdk';
import { User } from 'primebrick-commons-core';

@RegisterEntity('core')
@Entity()
export class Login extends AudibleEntity {
    @Column({ unique: true })
    username: string;

    @Column()
    password: string; //TODO: @mso-> save hashed password

    @OneToOne((type) => User)
    @JoinColumn()
    user: User;
}
