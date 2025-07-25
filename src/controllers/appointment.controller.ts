import { Request, Response } from "express";
import { AppointmentModel } from "../models/Appointment";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await AppointmentModel.create(req.body);
    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllAppointments = async (_req: Request, res: Response) => {
  const appointments = await AppointmentModel.findAll();
  res.json(appointments);
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
  const deleted = await AppointmentModel.destroy({ where: { id: req.params.id } });
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
        .json({ error: `Não é possível aceitar um agendamento com status '${appointment.status}'` });
    }
    appointment.status = "confirmed";
    await appointment.save();
    res.json(appointment);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Erro ao confirmar agendamento" });
  }
};
