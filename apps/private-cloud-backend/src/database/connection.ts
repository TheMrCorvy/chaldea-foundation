import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

let prisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
    if (!prisma) {
        const host = process.env.DB_HOST || 'localhost';
        const port = Number(process.env.DB_PORT) || 3306;
        const user = process.env.DB_USERNAME || 'root';
        const password = process.env.DB_PASSWORD || '';
        const database = process.env.DB_NAME || 'mydb';

        const adapter = new PrismaMariaDb({
            host,
            port,
            user,
            password,
            database,
        });

        prisma = new PrismaClient({ adapter });
    }
    return prisma;
}

export async function disconnect(): Promise<void> {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }
}
