module.exports = {
  type: 'sqlite',
  database: (() => {
    if (process.env.NODE_ENV === 'test') {
      return 'src/database/test.sqlite';
    }
    return 'src/database/database.sqlite';
  })(),
  migrations: ['src/database/migrations/**.ts'],
  entities: ['src/entities/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/entities',
  },
};
