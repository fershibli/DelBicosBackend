// If you meant to use a standard Express Response, import it like this:
import { Request, Response } from 'express';

export const loading = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Loading screen endpoint' });
};