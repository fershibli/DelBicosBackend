import { Request, Response } from "express";

import { Op } from "sequelize";

import { sequelize } from "../config/database";

import { ProfessionalAvailabilityModel } from "../models/ProfessionalAvailability";

import { DayOverrideModel } from "../models/DayOverride";

export class AvailabilityController {
  /* ======================================================
     RAW AVAILABILITY
  ====================================================== */

  async getAvailability(
    req: Request,
    res: Response
  ) {
    try {
      const professionalId = parseInt(
        req.params.professionalId
      );

      const availabilities =
        await ProfessionalAvailabilityModel.findAll(
          {
            where: {
              professional_id:
                professionalId,
            },

            order: [
              ["created_at", "ASC"],
            ],
          }
        );

      const overrides =
        await DayOverrideModel.findAll({
          where: {
            professional_id:
              professionalId,
          },

          order: [["date", "ASC"]],
        });

      return res.json({
        availabilities,
        dayOverrides: overrides,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao buscar disponibilidade.",
      });
    }
  }





  /* ======================================================
     UPDATE RAW AVAILABILITY
  ====================================================== */

  async updateAvailability(
    req: Request,
    res: Response
  ) {
    const professionalId = parseInt(
      req.params.professionalId
    );

    const {
      recurringRules,
      specialPeriods,
      blocks,
      dayOverrides,
    } = req.body;

    const transaction =
      await sequelize.transaction();

    try {
      await ProfessionalAvailabilityModel.destroy(
        {
          where: {
            professional_id:
              professionalId,
          },

          transaction,
        }
      );

      await DayOverrideModel.destroy({
        where: {
          professional_id:
            professionalId,
        },

        transaction,
      });





      /* ======================================================
         RECURRING RULES
      ====================================================== */

      if (recurringRules?.length) {
        for (const rule of recurringRules) {
          const bitmask =
            "0000000"
              .split("")
              .map((_, i) =>
                rule.days.includes(i)
                  ? "1"
                  : "0"
              )
              .join("");

          await ProfessionalAvailabilityModel.create(
            {
              professional_id:
                professionalId,

              days_of_week:
                bitmask,

              recurrence_pattern:
                "weekly",

              start_time:
                rule.startTime,

              end_time:
                rule.endTime,

              is_available: true,
            },

            {
              transaction,
            }
          );
        }
      }





      /* ======================================================
         SPECIAL PERIODS
      ====================================================== */

      if (specialPeriods?.length) {
        for (const period of specialPeriods) {
          await ProfessionalAvailabilityModel.create(
            {
              professional_id:
                professionalId,

              recurrence_pattern:
                "none",

              start_day:
                period.startDate,

              end_day:
                period.endDate,

              start_time:
                period.startTime,

              end_time:
                period.endTime,

              is_available: true,
            },

            {
              transaction,
            }
          );
        }
      }





      /* ======================================================
         BLOCKS
      ====================================================== */

      if (blocks?.length) {
        for (const block of blocks) {
          await ProfessionalAvailabilityModel.create(
            {
              professional_id:
                professionalId,

              recurrence_pattern:
                "none",

              start_day:
                block.startDate,

              end_day:
                block.endDate,

              start_time:
                block.allDay
                  ? "00:00"
                  : block.startTime,

              end_time:
                block.allDay
                  ? "23:59"
                  : block.endTime,

              is_available: false,
            },

            {
              transaction,
            }
          );
        }
      }





      /* ======================================================
         DAY OVERRIDES
      ====================================================== */

      if (dayOverrides?.length) {
        for (const override of dayOverrides) {
          await DayOverrideModel.upsert(
            {
              professional_id:
                professionalId,

              date: override.date,

              start_time:
                override.startTime,

              end_time:
                override.endTime,
            },

            {
              transaction,
            }
          );
        }
      }

      await transaction.commit();

      return res.json({
        success: true,
      });
    } catch (error) {
      await transaction.rollback();

      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao atualizar disponibilidade.",
      });
    }
  }





  /* ======================================================
     RESOLVED CALENDAR
  ====================================================== */

  async getResolvedCalendar(
    req: Request,
    res: Response
  ) {
    try {
      const professionalId = parseInt(
        req.params.professionalId
      );

      const month =
        req.query.month?.toString();

      if (!month) {
        return res.status(400).json({
          error:
            "Parâmetro month obrigatório.",
        });
      }

      const [year, monthIndex] =
        month.split("-").map(Number);

      const totalDays =
        new Date(
          year,
          monthIndex,
          0
        ).getDate();

      const startDate =
        `${month}-01`;

      const endDate =
        `${month}-${String(
          totalDays
        ).padStart(2, "0")}`;





      const availabilities =
        await ProfessionalAvailabilityModel.findAll(
          {
            where: {
              professional_id:
                professionalId,
            },
          }
        );

      const overrides =
        await DayOverrideModel.findAll({
          where: {
            professional_id:
              professionalId,

            date: {
              [Op.between]: [
                startDate,
                endDate,
              ],
            },
          },
        });





      const calendar: any[] = [];





      for (
        let day = 1;
        day <= totalDays;
        day++
      ) {
        const date =
          `${month}-${String(
            day
          ).padStart(2, "0")}`;

        const currentDate =
          new Date(
            `${date}T12:00:00`
          );

        const dayOfWeek =
          currentDate.getDay();





        /* ======================================================
           PRIORITY 1 → BLOCK
        ====================================================== */

        const blocked =
          availabilities.find(
            (a) => {
              if (
                a.is_available
              )
                return false;

              if (
                !a.start_day ||
                !a.end_day
              )
                return false;

              const start =
                new Date(
                  a.start_day
                )
                  .toISOString()
                  .slice(0, 10);

              const end =
                new Date(
                  a.end_day
                )
                  .toISOString()
                  .slice(0, 10);

              return (
                date >= start &&
                date <= end
              );
            }
          );

        if (blocked) {
          calendar.push({
            date,

            status:
              "blocked",
          });

          continue;
        }





        /* ======================================================
           PRIORITY 2 → DAY OVERRIDE
        ====================================================== */

        const override =
          overrides.find(
            (o) => o.date === date
          );

        if (override) {
          calendar.push({
            date,

            status:
              "available",

            startTime:
              override.start_time?.substring(
                0,
                5
              ),

            endTime:
              override.end_time?.substring(
                0,
                5
              ),
          });

          continue;
        }





        /* ======================================================
           PRIORITY 3 → SPECIAL PERIODS
        ====================================================== */

        const specialPeriod =
          availabilities.find(
            (a) => {
              if (
                !a.is_available
              )
                return false;

              if (
                a.recurrence_pattern !==
                "none"
              )
                return false;

              if (
                !a.start_day ||
                !a.end_day
              )
                return false;

              const start =
                new Date(
                  a.start_day
                )
                  .toISOString()
                  .slice(0, 10);

              const end =
                new Date(
                  a.end_day
                )
                  .toISOString()
                  .slice(0, 10);

              return (
                date >= start &&
                date <= end
              );
            }
          );

        if (specialPeriod) {
          calendar.push({
            date,

            status:
              "available",

            startTime:
              specialPeriod.start_time.substring(
                0,
                5
              ),

            endTime:
              specialPeriod.end_time.substring(
                0,
                5
              ),
          });

          continue;
        }





        /* ======================================================
           PRIORITY 4 → WEEKLY RULES
        ====================================================== */

        const recurring =
          availabilities.find(
            (a) => {
              if (
                !a.is_available
              )
                return false;

              if (
                a.recurrence_pattern !==
                "weekly"
              )
                return false;

              const bit =
                a.days_of_week?.[
                  dayOfWeek
                ];

              return bit === "1";
            }
          );

        if (recurring) {
          calendar.push({
            date,

            status:
              "available",

            startTime:
              recurring.start_time.substring(
                0,
                5
              ),

            endTime:
              recurring.end_time.substring(
                0,
                5
              ),
          });

          continue;
        }





        /* ======================================================
           DEFAULT
        ====================================================== */

        calendar.push({
          date,

          status:
            "unavailable",
        });
      }

      return res.json(calendar);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao resolver calendário.",
      });
    }
  }





  /* ======================================================
     UPDATE DAY OVERRIDE
  ====================================================== */

  async updateDayOverride(
    req: Request,
    res: Response
  ) {
    try {
      const professionalId = parseInt(
        req.params.professionalId
      );

      const {
        date,
        startTime,
        endTime,
      } = req.body;

      await DayOverrideModel.upsert({
        professional_id:
          professionalId,

        date,

        start_time:
          startTime,

        end_time:
          endTime,
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao salvar override.",
      });
    }
  }





  /* ======================================================
     REMOVE OVERRIDE
  ====================================================== */

  async removeDayOverride(
    req: Request,
    res: Response
  ) {
    try {
      const professionalId = parseInt(
        req.params.professionalId
      );

      const date =
        req.params.date;

      await DayOverrideModel.destroy({
        where: {
          professional_id:
            professionalId,

          date,
        },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao remover override.",
      });
    }
  }





  /* ======================================================
     BLOCK DAY
  ====================================================== */

  async blockDay(
    req: Request,
    res: Response
  ) {
    try {
      const professionalId = parseInt(
        req.params.professionalId
      );

      const { date } = req.body;

      await ProfessionalAvailabilityModel.destroy(
        {
          where: {
            professional_id:
              professionalId,

            start_day: date,

            end_day: date,

            is_available:
              false,
          },
        }
      );

      await ProfessionalAvailabilityModel.create(
        {
          professional_id:
            professionalId,

          recurrence_pattern:
            "none",

          start_day: date,

          end_day: date,

          start_time:
            "00:00",

          end_time:
            "23:59",

          is_available:
            false,
        }
      );

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao bloquear dia.",
      });
    }
  }





  /* ======================================================
     UNBLOCK DAY
  ====================================================== */

  async unblockDay(
    req: Request,
    res: Response
  ) {
    try {
      const professionalId = parseInt(
        req.params.professionalId
      );

      const date =
        req.params.date;

      await ProfessionalAvailabilityModel.destroy(
        {
          where: {
            professional_id:
              professionalId,

            start_day: date,

            end_day: date,

            is_available:
              false,
          },
        }
      );

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          "Erro ao desbloquear dia.",
      });
    }
  }
}

