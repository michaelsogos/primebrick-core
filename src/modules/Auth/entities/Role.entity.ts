/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { AudibleEntity } from 'primebrick-sdk';
import { User } from './User.entity';
import { MetaMenuItem } from '../../MetaData/entities/MetaMenuItem.entity';

@Entity()
export class Role extends AudibleEntity {
    @Column({ unique: true })
    name: string;

    @ManyToMany((type) => User, (T) => T.roles)
    users: User[];

    @ManyToMany((type) => MetaMenuItem, (T) => T.roles)
    @JoinTable()
    menuItems: MetaMenuItem[];
}
