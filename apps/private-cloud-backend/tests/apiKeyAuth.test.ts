import { Request, Response, NextFunction } from 'express';
import { authenticateApiKey } from '../src/middleware/apiKeyAuth';
import { getPrisma } from '../src/database/connection';
import bcrypt from 'bcrypt';
import { HttpMethod } from '@prisma/client';

jest.mock('../src/database/connection', () => ({
    getPrisma: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

type MockRequest = Partial<Request> & {
    headers: { [key: string]: string | undefined };
    apiKey?: string;
    apiKeyId?: number;
    apiKeyName?: string;
};

type MockResponse = Partial<Response> & {
    status: jest.Mock;
    json: jest.Mock;
    setHeader: jest.Mock;
};

describe('apiKeyAuth middleware', () => {
    let mockRequest: MockRequest;
    let mockResponse: MockResponse;
    let mockNext: NextFunction;
    let mockPrisma: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            headers: {},
            query: {},
            method: 'GET',
            path: '/api/v1/serve-episode',
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            setHeader: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();

        mockPrisma = {
            apiKey: {
                findMany: jest.fn(),
                update: jest.fn().mockResolvedValue({}),
            },
        };
        (getPrisma as jest.Mock).mockReturnValue(mockPrisma);
    });

    it('should return 401 when no API key is provided', async () => {
        const middleware = authenticateApiKey();
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it('should return 403 when API key hash does not match', async () => {
        mockRequest.headers['x-api-key'] = 'apc_invalid';
        mockPrisma.apiKey.findMany.mockResolvedValue([
            {
                id: 1,
                name: 'Test App',
                hash: 'some_hash',
                permissions: [],
            },
        ]);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const middleware = authenticateApiKey();
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should authenticate and set request variables when key is valid and has permission', async () => {
        mockRequest.headers['x-api-key'] = 'apc_valid';
        mockPrisma.apiKey.findMany.mockResolvedValue([
            {
                id: 1,
                name: 'Test App',
                hash: 'matching_hash',
                permissions: [
                    {
                        method: HttpMethod.GET,
                        route: '/api/v1/serve-episode',
                    },
                ],
            },
        ]);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const middleware = authenticateApiKey();
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRequest.apiKeyId).toBe(1);
        expect(mockRequest.apiKeyName).toBe('Test App');
    });

    it('should return 403 when key is valid but does not have permission for route', async () => {
        mockRequest.headers['x-api-key'] = 'apc_no_permission';
        mockPrisma.apiKey.findMany.mockResolvedValue([
            {
                id: 1,
                name: 'Test App',
                hash: 'matching_hash',
                permissions: [
                    {
                        method: HttpMethod.POST, // expect GET
                        route: '/api/v1/serve-episode',
                    },
                ],
            },
        ]);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const middleware = authenticateApiKey();
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
});
