"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'fernando@delbicos.com.br'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!users.length)
      throw new Error("Usuário 'fernando@delbicos.com.br' não encontrado.");

    const professionals = await queryInterface.sequelize.query(
      `SELECT id FROM professional WHERE user_id = ${users[0].id}`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (!professionals.length)
      throw new Error("Profissional 'Fernando Rasmut' não encontrado.");
    const professionalId = professionals[0].id;

    await queryInterface.bulkInsert("professional_availability", [
      {
        professional_id: professionalId,
        days_of_week: "0111110",
        start_time: "09:00:00",
        end_time: "18:00:00",
        recurrence_pattern: "weekly",
        is_available: true,
        created_at: now,
        updated_at: now,
      },
      {
        professional_id: professionalId,
        days_of_week: "0000001",
        start_time: "09:00:00",
        end_time: "13:00:00",
        recurrence_pattern: "weekly",
        is_available: true,
        created_at: now,
        updated_at: now,
      },
      {
        professional_id: professionalId,
        days_of_week: "1111111",
        start_time: "18:00:00",
        end_time: "22:00:00",
        recurrence_pattern: "weekly",
        is_available: true,
        created_at: now,
        updated_at: now,
      },
      {
        professional_id: professionalId,
        start_day: new Date("2026-01-10"),
        end_day: new Date("2026-01-31"),
        start_time: "00:00:00",
        end_time: "23:59:59",
        recurrence_pattern: "none",
        is_available: false,
        created_at: now,
        updated_at: now,
      },
      {
        professional_id: professionalId,
        start_day: new Date("2025-11-15"),
        end_day: new Date("2025-11-15"),
        start_time: "10:00:00",
        end_time: "16:00:00",
        recurrence_pattern: "none",
        is_available: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'fernando@delbicos.com.br'`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    if (users.length > 0) {
      const professionals = await queryInterface.sequelize.query(
        `SELECT id FROM professional WHERE user_id = ${users[0].id}`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      if (professionals.length > 0) {
        await queryInterface.bulkDelete(
          "professional_availability",
          { professional_id: professionals[0].id },
          {}
        );
      }
    }
  },
};
