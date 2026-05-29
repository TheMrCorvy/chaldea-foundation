import { Request, Response } from 'express';

const healthController = (_req: Request, res: Response): void => {
    res.status(200).json({
        status: 'OK',
        message: 'Anime Private Cloud Backend is running.',
        timestamp: new Date().toISOString(),
    });
};

export default healthController;
