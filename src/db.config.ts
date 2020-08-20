import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const CoordinatorConnectionConfig: TypeOrmModuleOptions = {
    name: 'primebrick_coordinator',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'primebrick_coordinator',
    entities: ['dist/modules/TenantManager/entities/*.js'],
    synchronize: false,
    subscribers: [],
    autoLoadEntities: true,
    migrationsTableName: 'db_migration_history',
    migrations: ['dist/migrations/coordinator/*.js'],
    cli: {
        migrationsDir: 'src/migrations/coordinator',
    },
};
