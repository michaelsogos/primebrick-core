import { Entity, Column } from 'typeorm';
import { AudibleEntity } from 'primebrick-sdk';

@Entity()
export class MetaView extends AudibleEntity {
    @Column({
        nullable: false,
        unique: true,
    })
    name: string;

    @Column('json')
    definition: any;
}
