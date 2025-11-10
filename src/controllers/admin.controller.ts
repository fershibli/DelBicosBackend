import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { AdminModel } from '../models/Admin';
import { AppointmentModel } from '../models/Appointment';
import { ProfessionalModel } from '../models/Professional';
import { sequelize } from '../config/database';
import { Op, Sequelize } from 'sequelize';

export const AdminController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ error: 'Senha inválida' });

      const isAdmin = await AdminModel.findOne({ where: { user_id: user.id } });
      if (!isAdmin) return res.status(403).json({ error: 'Apenas administradores têm acesso' });

      const payload = {
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
        admin: true,
      } as any;

      const secret = (process.env.SECRET_KEY || 'secret') as unknown as jwt.Secret;
  const token = (jwt as any).sign(payload as any, secret, { expiresIn: process.env.EXPIRES_IN || '1h' });

      return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, admin: true } });
    } catch (error: any) {
      console.error('Admin login error', error);
      return res.status(500).json({ error: 'Erro interno' });
    }
  },

  // Stats for dashboard: returns last 12 months counts grouped by month
  stats: async (req: Request, res: Response) => {
    try {
      const year = Number(req.query.year) || new Date().getFullYear();

      // Users per month
      const users: any[] = await UserModel.findAll({
        attributes: [[Sequelize.fn('MONTH', Sequelize.col('created_at')), 'month'], [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        where: sequelize.where(Sequelize.fn('YEAR', Sequelize.col('created_at')), year),
        group: ['month'],
        raw: true,
      }) as any[];

      // Professionals per month
      const professionals: any[] = await ProfessionalModel.findAll({
        attributes: [[Sequelize.fn('MONTH', Sequelize.col('created_at')), 'month'], [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        where: sequelize.where(Sequelize.fn('YEAR', Sequelize.col('created_at')), year),
        group: ['month'],
        raw: true,
      }) as any[];

      // Appointments per month and status
      const appointments: any[] = await AppointmentModel.findAll({
        attributes: [
          [Sequelize.fn('MONTH', Sequelize.col('created_at')), 'month'],
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        where: sequelize.where(Sequelize.fn('YEAR', Sequelize.col('created_at')), year),
        group: ['month', 'status'],
        raw: true,
      }) as any[];

      // Build month arrays (1..12)
      const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1 }));

  const usersByMonth = months.map((m) => ({ month: m.month, count: Number((users.find((u: any) => Number(u.month) === m.month) || { count: 0 }).count) }));
  const professionalsByMonth = months.map((m) => ({ month: m.month, count: Number((professionals.find((p: any) => Number(p.month) === m.month) || { count: 0 }).count) }));

      const appointmentsByMonth = months.map((m) => {
        const month = m.month;
  const pending = Number((appointments.find((a: any) => Number(a.month) === month && a.status === 'pending') || { count: 0 }).count || 0);
  const confirmed = Number((appointments.find((a: any) => Number(a.month) === month && a.status === 'confirmed') || { count: 0 }).count || 0);
  const completed = Number((appointments.find((a: any) => Number(a.month) === month && a.status === 'completed') || { count: 0 }).count || 0);
  const canceled = Number((appointments.find((a: any) => Number(a.month) === month && a.status === 'canceled') || { count: 0 }).count || 0);
        const totalRequested = pending + confirmed + completed + canceled;
        return { month, totalRequested, completed, canceled, pending, confirmed };
      });

      return res.json({ year, usersByMonth, professionalsByMonth, appointmentsByMonth });
    } catch (error) {
      console.error('Admin stats error', error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  },
};
