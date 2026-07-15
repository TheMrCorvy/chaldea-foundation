import { Request, Response, NextFunction, RequestHandler } from 'express';
import { LRUCache } from 'lru-cache';
import { createHash } from 'crypto';
import bcrypt from 'bcrypt';
import { getPrisma } from '../database/connection';
import { HttpMethod } from '@prisma/client';
import { logData } from '@salvatore.hakase/log-data';

declare module 'express-serve-static-core' {
    interface Request {
        apiKey?: string;
        apiKeyId?: number;
        apiKeyName?: string;
    }
}

interface CachedApiKey {
    id: number;
    name: string;
    permissions: { method: HttpMethod; route: string }[];
}

const cache = new LRUCache<string, CachedApiKey>({
    max: 500,
    ttl: 5 * 60 * 1000, // 5 minutes TTL
});

const sha256 = (value: string): string => {
    return createHash('sha256').update(value).digest('hex');
};

/**
 * Middleware to authenticate API keys against the database with caching.
 */
export const authenticateApiKey = (): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const rawKey =
            (req.headers['x-api-key'] as string) ||
            req.headers['authorization']?.replace('Bearer ', '') ||
            (req.query.apiKey as string);

        // Set CORS headers on all responses for media endpoints
        res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

        if (!rawKey) {
            res.status(401).json({
                error: 'API key required',
                message: 'Provide a valid API key in the x-api-key or authorization header',
            });
            return;
        }

        const cacheKey = sha256(rawKey);
        let resolved = cache.get(cacheKey);

        if (!resolved) {
            const prefix = rawKey.split('_')[0] + '_';
            const prisma = getPrisma();

            try {
                const candidates = await prisma.apiKey.findMany({
                    where: {
                        key_prefix: prefix,
                        is_active: true,
                        OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
                    },
                    include: {
                        permissions: true,
                    },
                });

                let matchedCandidate = null;
                for (const candidate of candidates) {
                    const isMatch = await bcrypt.compare(rawKey, candidate.hash);
                    if (isMatch) {
                        matchedCandidate = candidate;
                        break;
                    }
                }

                if (!matchedCandidate) {
                    logData({
                        title: 'Invalid API key attempt',
                        data: { prefix },
                        layer: 'auth_middleware',
                        type: 'warn',
                        addSeparatorAfter: true,
                        addSpaceAfter: true,
                        timeStamp: true,
                    });

                    res.status(403).json({
                        error: 'Invalid API key',
                        message: 'The provided API key is not valid',
                    });
                    return;
                }

                resolved = {
                    id: matchedCandidate.id,
                    name: matchedCandidate.name,
                    permissions: matchedCandidate.permissions.map(p => ({
                        method: p.method,
                        route: p.route,
                    })),
                };

                cache.set(cacheKey, resolved);
            } catch (error) {
                logData({
                    title: 'Error in API key authentication',
                    data: error instanceof Error ? { message: error.message, stack: error.stack } : { error },
                    layer: 'auth_middleware',
                    type: 'error',
                    addSeparatorAfter: true,
                    addSpaceAfter: true,
                    timeStamp: true,
                });

                res.status(500).json({
                    error: 'Internal server error',
                    message: 'Error verifying the API key',
                });
                return;
            }
        }

        // Check permissions
        const hasPermission = resolved.permissions.some(p => p.method === req.method && p.route === req.path);

        if (!hasPermission) {
            logData({
                title: 'Unauthorized route access attempt',
                data: { name: resolved.name, path: req.path, method: req.method },
                layer: 'auth_middleware',
                type: 'warn',
                addSeparatorAfter: true,
                addSpaceAfter: true,
                timeStamp: true,
            });

            res.status(403).json({
                error: 'Access denied',
                message: 'The API key does not have permission to access this route and method',
            });
            return;
        }

        // Non-blocking last_used_at update
        const prisma = getPrisma();
        prisma.apiKey
            .update({
                where: { id: resolved.id },
                data: { last_used_at: new Date() },
            })
            .catch((err: unknown) => {
                console.error('Failed to update API key last_used_at:', err);
            });

        req.apiKey = rawKey;
        req.apiKeyId = resolved.id;
        req.apiKeyName = resolved.name;
        next();
    };
};
