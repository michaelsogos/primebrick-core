const SnakeNamingStrategy = require('primebrick-sdk').SnakeNamingStrategy;

module.exports = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'primebrick_dev',
    entities: ['dist/modules/**/entities/*.js'],
    synchronize: false,
    subscribers: [],
    autoLoadEntities: true,
    migrationsTableName: 'db_migration_history',
    migrations: ['dist/db/migrations/*.js'],
    cli: {
        migrationsDir: 'src/db/migrations',
    },
    namingStrategy: new SnakeNamingStrategy(),
    entityPrefix: 'core_',
};
