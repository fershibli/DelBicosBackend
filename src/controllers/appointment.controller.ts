import { Request, Response } from "express";
import { AppointmentModel } from "../models/Appointment";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";
import { ProfessionalModel } from "../models/Professional";
import { ServiceModel } from "../models/Service";
import { PaymentService } from "../services/payment.service";
import { NotificationModel } from "../models/Notification";
import { AddressModel } from "../models/Address";
import { SubCategoryModel } from "../models/Subcategory";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";

const formatDate = (dateStr: string | Date) =>
  new Date(dateStr).toLocaleDateString("pt-BR");

const formatTime = (dateStr: string | Date) =>
  new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

// TODO: Remove this createAppointment and use confirmAndCreateAppointment from PaymentService instead (move remaining logic there)
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await AppointmentModel.create(req.body);

    const professional = await ProfessionalModel.findByPk(
      appointment.professional_id
    );
    const client = await ClientModel.findByPk(appointment.client_id);
    const service = await ServiceModel.findByPk(appointment.service_id);

    if (!professional || !client || !service) {
      console.error("Missing linked data for notification trigger.");
    } else {
      const clientUser = await UserModel.findByPk(client.user_id);
      const professionalUser = await UserModel.findByPk(professional.user_id);

      const appointmentTime = appointment.start_time.toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      );
      const appointmentDate =
        appointment.start_time.toLocaleDateString("pt-BR");

      if (professionalUser) {
        await NotificationModel.create({
          user_id: professionalUser.id,
          title: "Novo Agendamento Recebido",
          message: `Você recebeu um novo agendamento de ${
            clientUser?.name || "Cliente Desconhecido"
          } para o serviço '${
            service.title
          }' no dia ${appointmentDate} às ${appointmentTime}. Status: Pendente de Confirmação.`,
          notification_type: "appointment",
          related_entity_id: appointment.id,
          is_read: false,
        });
      }

      if (clientUser) {
        await NotificationModel.create({
          user_id: clientUser.id,
          title: "Agendamento Criado com Sucesso",
          message: `Seu agendamento para o serviço '${service.title}' no dia ${appointmentDate} às ${appointmentTime} foi criado. Aguardando confirmação do profissional.`,
          notification_type: "appointment",
          related_entity_id: appointment.id,
          is_read: false,
        });
      }
    }
    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const client = await ClientModel.findOne({ where: { user_id: userId } });
    const professional = await ProfessionalModel.findOne({
      where: { user_id: userId },
    });

    const whereClause: any = {};

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
  const authReq = req as AuthenticatedRequest;

  try {
    const appointmentId = Number(req.params.id);
    const authenticatedUserId = authReq.user?.id;

    if (!authenticatedUserId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }
    if (isNaN(appointmentId)) {
      return res.status(400).json({ error: "ID do agendamento inválido." });
    }

    const client = await ClientModel.findOne({
      where: { user_id: authenticatedUserId },
    });
    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }

    const appointment = await AppointmentModel.findOne({
      where: {
        id: appointmentId,
        client_id: client.id,
      },
      include: [
        {
          model: ServiceModel,
          as: "Service",
          include: [{ model: SubCategoryModel, as: "Subcategory" }],
        },
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
        {
          model: AddressModel,
          as: "Address",
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        error: "Agendamento não encontrado ou não pertence a este usuário.",
      });
    }

    const apptData: any = appointment;

    const invoice = {
      invoiceNumber: `NF${appointment.id.toString().padStart(6, "0")}`,
      date: formatDate(appointment.createdAt),

      customerName: apptData.Client?.User?.name || "Cliente não encontrado",
      customerCpf: apptData.Client?.cpf || "CPF não encontrado",
      customerAddress: apptData.Address
        ? `${apptData.Address.street}, ${apptData.Address.number} - ${apptData.Address.neighborhood} - ${apptData.Address.city}/${apptData.Address.state}`
        : "Endereço não fornecido",

      professionalName:
        apptData.Professional?.User?.name || "Profissional não encontrado",
      professionalCpf: apptData.Professional?.cpf || "CPF/CNPJ não encontrado",

      serviceName: apptData.Service?.title || "Serviço não encontrado",
      serviceDescription: apptData.Service?.description || "",
      servicePrice: parseFloat(apptData.Service?.price || "0"),

      serviceDate: formatDate(appointment.start_time),
      serviceTime: `${formatTime(appointment.start_time)} - ${formatTime(
        appointment.end_time
      )}`,

      total: parseFloat(apptData.Service?.price || "0"), // TODO: Se o preço puder mudar, buscar do PaymentIntent

      paymentMethod: "Cartão de Crédito", // TODO: Buscar do PaymentIntent
      transactionId: appointment.payment_intent_id || "N/A",
    };

    res.json(invoice);
  } catch (error: any) {
    console.error("Erro ao gerar invoice:", error);
    res
      .status(500)
      .json({ error: "Erro ao gerar invoice", details: error.message });
  }
};
