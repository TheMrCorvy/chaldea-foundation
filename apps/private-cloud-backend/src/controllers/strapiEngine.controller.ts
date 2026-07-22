import { Request, Response } from 'express';
import { startEngine, stopEngine } from '../services/statefulEngine.service';
import { TimeOptions } from '@repo/type-definitions/jobs';
import { logData } from '@salvatore.hakase/log-data';

const strapiEngineController = async (req: Request, res: Response): Promise<void> => {
    const action = req.headers['action'] as string | undefined;
    const during = req.headers['during'] as TimeOptions | 'until_finishing_jobs' | undefined;
    const every = req.headers['every'] as TimeOptions | undefined;

    const isStart = action === 'start_engine';
    const isStop = action === 'stop_engine';

    if (!isStart && !isStop && !action) {
        logData({
            title: 'Invalid headers or path in Strapi controller request',
            layer: 'queue_jobs',
            type: 'warn',
            timeStamp: true,
            data: {
                action,
                during,
                every,
            },
        });

        res.status(400).json({ error: 'Invalid headers' });
        return;
    }

    if (isStop) {
        logData({
            title: 'Stopping stateful engine via Strapi controller',
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
            data: {
                action,
                during,
                every,
            },
        });

        await stopEngine();

        res.status(200).json({ status: 'stopped', message: 'Stateful engine stopped successfully' });
        return;
    }

    if (isStart) {
        if (!every) {
            logData({
                title: 'Missing "every" header in Strapi controller request',
                layer: 'queue_jobs',
                type: 'warn',
                timeStamp: true,
                data: {
                    action,
                    during,
                    every,
                },
            });

            res.status(400).json({ error: 'Missing "every" header' });
            return;
        }
        if (!during) {
            logData({
                title: 'Missing "during" header in Strapi controller request',
                layer: 'queue_jobs',
                type: 'warn',
                timeStamp: true,
                data: {
                    action,
                    during,
                    every,
                },
            });

            res.status(400).json({ error: 'Missing "during" header' });
            return;
        }

        try {
            logData({
                title: 'Starting stateful engine via Strapi controller',
                layer: 'queue_jobs',
                type: 'info',
                timeStamp: true,
                data: {
                    action,
                    during,
                    every,
                },
            });

            await startEngine(every, during);

            res.status(200).json({
                status: 'started',
                message: `Stateful engine started successfully with every=${every} during=${during}`,
            });

            return;
        } catch (err) {
            logData({
                title: 'Error starting stateful engine via Strapi controller',
                data: err instanceof Error ? { message: err.message } : { error: String(err) },
                layer: '*',
                type: 'error',
                timeStamp: true,
            });

            res.status(400).json({
                error: err instanceof Error ? err.message : String(err),
            });

            return;
        }
    }

    res.status(400).json({ error: 'Invalid action or endpoint' });
};

export default strapiEngineController;
