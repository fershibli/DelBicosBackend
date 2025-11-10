import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/Admin';

export default async function adminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'Acesso negado. É obrigatório o envio de token JWT' });

  try {
    const decoded = (jwt.verify(token, process.env.SECRET_KEY || 'secret') as any) || {};
    const user = decoded.user;
    if (!user || !user.id) return res.status(403).json({ msg: 'Token inválido' });

    const isAdmin = await AdminModel.findOne({ where: { user_id: user.id } });
    if (!isAdmin) return res.status(403).json({ msg: 'Acesso negado: somente administradores' });

    // attach minimal user
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(403).json({ msg: 'Token inválido' });
  }
}
