import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => {
                if (err instanceof ApiError) next(err);
            })
    };
};

export { asyncHandler };