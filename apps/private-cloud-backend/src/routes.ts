import { Router, Request, Response } from 'express';
import {
    healthController,
    v1EpisodeController,
    v2EpisodeController,
    v2EpisodeSubtitlesController,
    v3EpisodePlaylistController,
    v3EpisodeSegmentController,
    entryPublishWebhookController,
    entryCreateWebhookController,
    entryUpdateWebhookController,
    entryDeleteWebhookController,
    strapiEngineController,
} from './controllers';
import { logData } from '@salvatore.hakase/log-data';

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

router.get('/api/v3/serve-episode/playlist.m3u8', (req: Request, res: Response) => {
    v3EpisodePlaylistController(req, res);
});

router.get('/api/v3/serve-episode/segment', (req: Request, res: Response) => {
    v3EpisodeSegmentController(req, res);
});

router.post('/api/v2/d-mail/platform-service/entry/publish', (req: Request, res: Response) => {
    entryPublishWebhookController(req, res);
});

router.post('/api/v2/d-mail/platform-service/entry/create', (req: Request, res: Response) => {
    entryCreateWebhookController(req, res);
});

router.post('/api/v2/d-mail/platform-service/entry/update', (req: Request, res: Response) => {
    entryUpdateWebhookController(req, res);
});

router.post('/api/v2/d-mail/platform-service/entry/delete', (req: Request, res: Response) => {
    entryDeleteWebhookController(req, res);
});

router.post('/api/v2/d-mail/platform-service/manage-engine', (req: Request, res: Response) => {
    strapiEngineController(req, res);
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
