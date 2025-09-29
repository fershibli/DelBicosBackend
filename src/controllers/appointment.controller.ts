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
    // const { status, date, start_date, end_date } = req.query;

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

    const whereClause: any = {};

    // Buscar agendamentos onde o usuário é cliente
    if (client) {
      whereClause.client_id = client.id;
    } else if (professional) {
      whereClause.professional_id = professional.id;
    } else {
      return res
        .status(404)
        .json({ error: "Nenhum cliente ou profissional associado ao usuário" });
    }

    const appointments = await AppointmentModel.findAll({
      where: {
        ...whereClause,
      },
      include: [
        { model: ServiceModel, as: "Service" },
        {
          model: ClientModel,
          as: "Client",
          include: [{ model: UserModel, as: "User" }],
        },
        {
          model: ProfessionalModel,
          as: "Professional",
          include: [{ model: UserModel, as: "User" }],
        },
      ],
      order: [["start_time", "ASC"]],
    });

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
      return res.status(400).json({
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

export const reviewAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  try {
    const appointment = await AppointmentModel.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    if (appointment.status !== "completed") {
      return res.status(400).json({
        error: `Não é possível avaliar um agendamento com status '${appointment.status}'`,
      });
    }
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        error: `A avaliação deve estar entre 0 e 5`,
      });
    }

    appointment.rating = rating;
    appointment.review = review;
    await appointment.save();
    res.json(appointment);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Erro ao avaliar agendamento" });
  }
};
