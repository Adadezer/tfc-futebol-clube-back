import { Request, Response, NextFunction } from 'express';

const error = (err: Error, req: Request, res: Response, _next: NextFunction)
: Response => res.status(500).json({ error: 'Internal Server Error' });

export default error;
