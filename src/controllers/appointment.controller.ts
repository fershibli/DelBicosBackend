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

export const getAppointmentInvoice = async (req: Request, res: Response) => {
  try {
    //const appointmentId = req.params.id;
    //const appointment = await AppointmentModel.findByPk(appointmentId);

    // Mocked invoice data conforme interface fornecida
    const invoice = {
      invoiceNumber: `NF${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`,
      date: new Date().toLocaleDateString("pt-BR"),
      customerName: "João da Silva Santos",
      customerCpf: "123.456.789-00",
      customerAddress:
        "Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01234-567",
      professionalName: "Maria Oliveira Costa",
      professionalCpf: "987.654.321-00",
      serviceName: "Limpeza Residencial Completa",
      serviceDescription:
        "Limpeza completa de casa com 3 quartos, incluindo cozinha, banheiros e áreas comuns",
      servicePrice: 150.0,
      serviceDate: new Date().toLocaleDateString("pt-BR"),
      serviceTime: "14:00 - 17:00",
      total: 610.0,
      paymentMethod: "Cartão de Crédito",
      transactionId: `TXN${Date.now()}`,
    };

    // No momento retornamos o mock sempre com status 200
    res.json(invoice);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar invoice" });
  }
};
