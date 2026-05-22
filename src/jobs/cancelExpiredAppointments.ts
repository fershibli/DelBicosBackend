import cron from "node-cron";
import { AppointmentModel } from "../models/Appointment";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";
import { NotificationModel } from "../models/Notification";
import logger, { logError } from "../utils/logger";
import { Op } from "sequelize";
import type { ScheduledTask } from "node-cron";

/**
 * Cron job para cancelar automaticamente agendamentos não confirmados após 12 horas
 * Executa a cada 15 minutos
 */
export const initializeCancelExpiredAppointmentsJob = (): ScheduledTask | null => {
  try {
    // Executa a cada 15 minutos: */15 * * * *
    const task = cron.schedule("*/15 * * * *", async () => {
      try {
        logger.info("Iniciando job de cancelamento de agendamentos expirados...");

        // Calcular data de 12 horas atrás
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

        // Buscar todos os agendamentos que estão pending há mais de 12 horas
        const expiredAppointments = await AppointmentModel.findAll({
          where: {
            status: "pending",
            createdAt: {
              [Op.lt]: twelveHoursAgo,
            },
          },
          include: [
            {
              model: ClientModel,
              as: "Client",
              include: [{ model: UserModel, as: "User" }],
            },
          ],
        });

        if (expiredAppointments.length === 0) {
          logger.info(
            "Nenhum agendamento expirado encontrado para cancelamento"
          );
          return;
        }

        logger.info(
          `Encontrados ${expiredAppointments.length} agendamentos expirados para cancelar`
        );

        // Cancelar cada agendamento expirado
        for (const appointment of expiredAppointments) {
          try {
            appointment.status = "canceled";
            await appointment.save();

            logger.info("Agendamento cancelado automaticamente", {
              appointmentId: appointment.id,
              clientId: appointment.client_id,
              professionalId: appointment.professional_id,
            });

            // Criar notificação para o cliente informando o cancelamento automático
            const apptData: any = appointment;
            const clientUser = apptData.Client?.User;

            if (clientUser) {
              await NotificationModel.create({
                user_id: clientUser.id,
                title: "Agendamento Expirado",
                message:
                  "Seu agendamento foi cancelado automaticamente por não ter sido confirmado no prazo de 12 horas.",
                notification_type: "appointment",
                related_entity_id: appointment.id,
                is_read: false,
              });
            }
          } catch (error: any) {
            logError(
              "Erro ao cancelar agendamento expirado",
              error,
              {
                appointmentId: appointment.id,
              }
            );
          }
        }

        logger.info(
          `Job de cancelamento finalizado: ${expiredAppointments.length} agendamentos processados`
        );
      } catch (error: any) {
        logError("Erro no job de cancelamento de agendamentos expirados", error);
      }
    });

    return task;
  } catch (error: any) {
    logError("Erro ao inicializar cron job de cancelamento", error);
    return null;
  }
};

/**
 * Função para parar o job (útil para testes ou shutdown)
 */
export const stopCancelExpiredAppointmentsJob = (task: ScheduledTask | null) => {
  if (task) {
    task.stop();
    logger.info("Job de cancelamento de agendamentos expirados parado");
  }
};
