export default ({ env }) => ({
    connection: {
        client: "mysql2",
        connection: {
            host: env("DATABASE_HOST", "localhost"),
            port: env.int("DATABASE_PORT", 3306),
            database: env("DATABASE_NAME", "chaldea_foundation"),
            user: env("DATABASE_USERNAME", "root"),
            password: env("DATABASE_PASSWORD", ""),
            ssl: env.bool("DATABASE_SSL", false),
        },
        debug: false,
    },
});
