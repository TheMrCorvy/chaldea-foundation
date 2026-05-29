import { Router, Request, Response } from 'express';
import {
    healthController,
    v1EpisodeController,
    v2EpisodeController,
    v2EpisodeSubtitlesController,
} from './controllers';

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

router.get('/api/v2/serve-episode/subtitles', (req, res) => {
    v2EpisodeSubtitlesController(req, res);
});

// 404 handler
router.use((req: Request, res: Response) => {
    console.log(`404 Not Found: ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
    });
});

export default router;
