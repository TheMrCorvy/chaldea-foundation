import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    console.log('🔄  Syncing Prisma schema with database...');

    try {
        // Using db push for simplicity as requested, which is suitable for this case.
        execSync('npx prisma db push', { stdio: 'inherit' });
        console.log('✅  Database schema is in sync');
    } catch (err) {
        console.error('❌  Failed to sync database schema:', err);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
