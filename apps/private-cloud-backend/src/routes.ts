import { Router, Request, Response } from 'express';
import {
    healthController,
    v1EpisodeController,
    v2EpisodeController,
    v2EpisodeSubtitlesController,
    entryPublishWebhookController,
} from './controllers';
import { logData } from '@repo/shared-utils/log-data';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    healthController(_req, res);
});

router.get('/api/v1/serve-episode', (req: Request, res: Response) => {
    v1EpisodeController(req, res);
});

router.get('/api/v2/serve-episode', (req: Request, res: Response) => {
    v2EpisodeController(req, res);
});

router.get('/api/v2/serve-episode/subtitles', (req: Request, res: Response) => {
    v2EpisodeSubtitlesController(req, res);
});

router.post('/api/v2/webhooks/platform-service/entry/publish', (req: Request, res: Response) => {
    entryPublishWebhookController(req, res);
});

// 404 handler
router.use((req: Request, res: Response) => {
    logData({
        title: '404 Not Found',
        data: { path: req.originalUrl },
        layer: 'external_http_requests',
        type: 'warn',
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
    });

    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
    });
});

export default router;
