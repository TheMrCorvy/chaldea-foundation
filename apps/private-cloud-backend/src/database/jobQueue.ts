import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getPool } from './connection';

export interface JobRow extends RowDataPacket {
    id: number;
    type: string;
    payload: unknown;
    status: 'pending' | 'processing' | 'done' | 'failed';
    attempts: number;
    last_error: string | null;
}

export async function addJobToQueue(type: string, payload: unknown): Promise<void> {
    const pool = getPool();
    await pool.query<ResultSetHeader>('INSERT INTO job_queue (type, payload) VALUES (?, ?)', [
        type,
        JSON.stringify(payload),
    ]);
}

/**
 * Atomically claims up to `limit` pending jobs by marking them as 'processing'.
 * Uses SELECT ... FOR UPDATE SKIP LOCKED so concurrent workers never double-pick.
 */
export async function claimPendingJobs(limit = 5): Promise<JobRow[]> {
    const pool = getPool();
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [rows] = await conn.query<JobRow[]>(
            `SELECT id, type, payload, status, attempts, last_error
             FROM job_queue
             WHERE status = 'pending'
             ORDER BY created_at ASC
             LIMIT ?
             FOR UPDATE SKIP LOCKED`,
            [limit]
        );

        if (rows.length > 0) {
            const ids = rows.map(r => r.id);
            await conn.query(`UPDATE job_queue SET status = 'processing', attempts = attempts + 1 WHERE id IN (?)`, [
                ids,
            ]);
        }

        await conn.commit();
        return rows;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

export async function markJobDone(id: number): Promise<void> {
    const pool = getPool();
    await pool.query(`UPDATE job_queue SET status = 'done' WHERE id = ?`, [id]);
}

export async function markJobFailed(id: number, error: string): Promise<void> {
    const pool = getPool();
    await pool.query(`UPDATE job_queue SET status = 'failed', last_error = ? WHERE id = ?`, [error, id]);
}
