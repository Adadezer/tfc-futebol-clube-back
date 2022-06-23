import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';

const jwtSecret = fs.readFileSync('jwt.evaluation.key', 'utf-8');

const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const token = req.headers.authorization;
  // console.log('token auth:', token);
  if (!token) return res.status(401).json({ message: 'Token not found' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    // console.log('decoded:', decoded);
    req.body = { ...req.body, decoded };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'expired or invalid token' });
  }
};
export default auth;
