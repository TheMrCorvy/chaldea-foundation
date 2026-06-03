import dotenv from 'dotenv';
dotenv.config();

import { getPool, closePool } from '../src/database/connection';

async function main() {
    const pool = getPool();

    await pool.query(`
        CREATE TABLE IF NOT EXISTS job_queue (
            id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            type        VARCHAR(100) NOT NULL,
            payload     JSON         NOT NULL,
            status      ENUM('pending', 'processing', 'done', 'failed') NOT NULL DEFAULT 'pending',
            attempts    TINYINT UNSIGNED NOT NULL DEFAULT 0,
            last_error  TEXT NULL,
            created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_status_created (status, created_at)
        )
    `);

    console.log('✅  job_queue table is ready');
    await closePool();
}

main().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
