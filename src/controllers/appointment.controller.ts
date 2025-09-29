import { Request, Response } from "express";
import { AppointmentModel } from "../models/Appointment";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";
import { ProfessionalModel } from "../models/Professional";
import { ServiceModel } from "../models/Service";
import { Op } from "sequelize";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await AppointmentModel.create(req.body);
    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { status, date, start_date, end_date } = req.query;

    // Verificar se o usuário existe
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Buscar cliente e profissional associados ao usuário
    const client = await ClientModel.findOne({ where: { user_id: userId } });
    const professional = await ProfessionalModel.findOne({
      where: { user_id: userId },
    });

    // Construir filtros de consulta
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (date) {
      whereClause.start_time = {
        [Op.gte]: new Date(`${date} 00:00:00`),
        [Op.lt]: new Date(`${date} 23:59:59`),
      };
    } else if (start_date || end_date) {
      whereClause.start_time = {};
      if (start_date) {
        whereClause.start_time[Op.gte] = new Date(`${start_date} 00:00:00`);
      }
      if (end_date) {
        whereClause.start_time[Op.lte] = new Date(`${end_date} 23:59:59`);
      }
    }

    const appointments = {
      asClient: [] as any[],
      asProfessional: [] as any[],
    };

    // Buscar agendamentos onde o usuário é cliente
    if (client) {
      appointments.asClient = await AppointmentModel.findAll({
        where: {
          client_id: client.id,
          ...whereClause,
        },
        include: [
          {
            model: ServiceModel,
            as: "service",
          },
          {
            model: ProfessionalModel,
            as: "professional",
          },
        ],
        order: [["start_time", "ASC"]],
      });
    }

    // Buscar agendamentos onde o usuário é profissional
    if (professional) {
      appointments.asProfessional = await AppointmentModel.findAll({
        where: {
          professional_id: professional.id,
          ...whereClause,
        },
        include: [
          {
            model: ServiceModel,
            as: "service",
          },
          {
            model: ClientModel,
            as: "client",
          },
        ],
        order: [["start_time", "ASC"]],
      });
    }

    res.json(appointments);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  const appointment = await AppointmentModel.findByPk(req.params.id);
  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404).json({ error: "Agendamento não encontrado" });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  const appointment = await AppointmentModel.findByPk(req.params.id);
  if (appointment) {
    await appointment.update(req.body);
    res.json(appointment);
  } else {
    res.status(404).json({ error: "Agendamento não encontrado" });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  const deleted = await AppointmentModel.destroy({
    where: { id: req.params.id },
  });
  if (deleted) {
    res.json({ message: "Agendamento deletado com sucesso" });
  } else {
    res.status(404).json({ error: "Agendamento não encontrado" });
  }
};

export const confirmAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const appointment = await AppointmentModel.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    if (appointment.status !== "pending") {
      return res
        .status(400)
        .json({
          error: `Não é possível aceitar um agendamento com status '${appointment.status}'`,
        });
    }
    appointment.status = "confirmed";
    await appointment.save();
    res.json(appointment);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Erro ao confirmar agendamento" });
  }
};
