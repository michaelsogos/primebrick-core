/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToMany, Tree, TreeParent, TreeChildren } from 'typeorm';
import { AudibleEntity } from 'primebrick-sdk';
import { Role } from '../../Auth/entities/Role.entity';

@Entity({ orderBy: { orderPriority: 'ASC' } })
@Tree('closure-table')
export class MetaMenuItem extends AudibleEntity {
    @Column({
        nullable: false,
    })
    labelKey: string;

    @Column({
        nullable: true,
    })
    icon: string;

    @Column({
        nullable: true,
    })
    color: string;

    @Column({
        nullable: true,
    })
    viewName: string;

    @Column()
    orderPriority: number;

    @TreeParent()
    parent: MetaMenuItem;

    @TreeChildren()
    children: MetaMenuItem[];

    @ManyToMany(
        type => Role,
        T => T.menuItems,
    )
    roles: Role[];
}
