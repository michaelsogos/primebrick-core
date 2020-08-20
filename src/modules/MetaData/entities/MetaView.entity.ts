import { Entity, Column } from 'typeorm';
import { AudibleEntity } from 'primebrick-sdk';

@Entity()
export class MetaView extends AudibleEntity {
    @Column({
        nullable: false,
    })
    name: string;

    @Column('json')
    definition: any;
}
