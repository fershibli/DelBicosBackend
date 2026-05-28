import { Request, Response } from "express";
import { ProfessionalAvailabilityModel } from "../models/ProfessionalAvailability";
import { DayOverrideModel } from "../models/DayOverride";
import { sequelize } from "../config/database";

export class AvailabilityController {
  async getAvailability(req: Request, res: Response) {
    const professionalId = parseInt(req.params.professionalId);
    try {
      const availabilities = await ProfessionalAvailabilityModel.findAll({
        where: { professional_id: professionalId },
      });
      const overrides = await DayOverrideModel.findAll({
        where: { professional_id: professionalId },
      });

      // Mapeia para o formato que o frontend espera
      const recurringRules: any[] = [];
      const specialPeriods: any[] = [];
      const blocks: any[] = [];

      availabilities.forEach((a) => {
        const startTime = a.start_time?.substring(0, 5);
        const endTime = a.end_time?.substring(0, 5);

        if (a.recurrence_pattern === "weekly" && a.is_available) {
          const days = a.days_of_week!
            .split("")
            .map((c, i) => (c === "1" ? i : -1))
            .filter((i) => i !== -1);
          recurringRules.push({
            id: a.id.toString(),
            days,
            startTime,
            endTime,
          });
        } else if (a.recurrence_pattern === "none" && a.is_available && a.start_day && a.end_day) {
          specialPeriods.push({
            id: a.id.toString(),
            startDate: new Date(a.start_day).toISOString().slice(0, 10),
            endDate: new Date(a.end_day).toISOString().slice(0, 10),
            startTime,
            endTime,
          });
        } else if (a.recurrence_pattern === "none" && !a.is_available && a.start_day && a.end_day) {
          blocks.push({
            id: a.id.toString(),
            startDate: new Date(a.start_day).toISOString().slice(0, 10),
            endDate: new Date(a.end_day).toISOString().slice(0, 10),
            allDay: startTime === "00:00" && endTime === "23:59",
            startTime,
            endTime,
          });
        }
      });

      const dayOverrides = overrides.map((o) => ({
        date: o.date,
        startTime: o.start_time?.substring(0, 5) || null,
        endTime: o.end_time?.substring(0, 5) || null,
      }));

      return res.json({ recurringRules, specialPeriods, blocks, dayOverrides });
    } catch (error) {
      console.error("Error fetching availability:", error);
      return res.status(500).json({ error: "Erro ao buscar disponibilidade." });
    }
  }

  async updateAvailability(req: Request, res: Response) {
    const professionalId = parseInt(req.params.professionalId);
    const { recurringRules, specialPeriods, blocks, dayOverrides } = req.body;

    const transaction = await sequelize.transaction();
    try {
      // Limpa todos os dados anteriores
      await ProfessionalAvailabilityModel.destroy({
        where: { professional_id: professionalId },
        transaction,
      });
      await DayOverrideModel.destroy({
        where: { professional_id: professionalId },
        transaction,
      });

      // Insere regras recorrentes
      if (recurringRules?.length) {
        for (const rule of recurringRules) {
          const daysBitmask = "0000000"
            .split("")
            .map((_, i) => (rule.days.includes(i) ? "1" : "0"))
            .join("");
          await ProfessionalAvailabilityModel.create(
            {
              professional_id: professionalId,
              days_of_week: daysBitmask,
              recurrence_pattern: "weekly",
              start_time: rule.startTime,
              end_time: rule.endTime,
              is_available: true,
            },
            { transaction }
          );
        }
      }

      // Insere períodos especiais
      if (specialPeriods?.length) {
        for (const sp of specialPeriods) {
          await ProfessionalAvailabilityModel.create(
            {
              professional_id: professionalId,
              recurrence_pattern: "none",
              start_day: sp.startDate,
              end_day: sp.endDate,
              start_time: sp.startTime,
              end_time: sp.endTime,
              is_available: true,
            },
            { transaction }
          );
        }
      }

      // Insere bloqueios
      if (blocks?.length) {
        for (const block of blocks) {
          await ProfessionalAvailabilityModel.create(
            {
              professional_id: professionalId,
              recurrence_pattern: "none",
              start_day: block.startDate,
              end_day: block.endDate,
              start_time: block.allDay ? "00:00" : block.startTime,
              end_time: block.allDay ? "23:59" : block.endTime,
              is_available: false,
            },
            { transaction }
          );
        }
      }

      // Insere overrides diários
      if (dayOverrides?.length) {
        for (const override of dayOverrides) {
          if (override.startTime && override.endTime) {
            await DayOverrideModel.create(
              {
                professional_id: professionalId,
                date: override.date,
                start_time: override.startTime,
                end_time: override.endTime,
              },
              { transaction }
            );
          }
          // Se startTime não for informado, não insere (indica seguir regra recorrente)
        }
      }

      await transaction.commit();
      return res.json({ success: true });
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating availability:", error);
      return res.status(500).json({ error: "Erro ao atualizar disponibilidade." });
    }
  }
}