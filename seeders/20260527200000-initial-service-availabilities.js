"use strict";

/**
 * Popula service_availability para os serviços já criados pelo seeder 007.
 * Cada serviço recebe disponibilidades em dias úteis (seg–sex) com dois turnos.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Buscar os primeiros 7 serviços (os criados pelo seeder 007)
    const services = await queryInterface.sequelize.query(
      `SELECT id FROM service ORDER BY id LIMIT 7`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (services.length === 0) return;

    const now = new Date();

    // Padrões de disponibilidade variados para tornar os dados de dev realistas
    const patterns = [
      // seg, qua, sex — manhã
      [
        { day: 1, start: "08:00", end: "12:00" },
        { day: 3, start: "08:00", end: "12:00" },
        { day: 5, start: "08:00", end: "12:00" },
      ],
      // ter, qui — tarde
      [
        { day: 2, start: "13:00", end: "18:00" },
        { day: 4, start: "13:00", end: "18:00" },
      ],
      // seg–sex — período integral
      [
        { day: 1, start: "09:00", end: "17:00" },
        { day: 2, start: "09:00", end: "17:00" },
        { day: 3, start: "09:00", end: "17:00" },
        { day: 4, start: "09:00", end: "17:00" },
        { day: 5, start: "09:00", end: "17:00" },
      ],
      // sab — dia inteiro
      [{ day: 6, start: "08:00", end: "16:00" }],
      // seg, qua — manhã e tarde
      [
        { day: 1, start: "07:00", end: "11:00" },
        { day: 1, start: "14:00", end: "18:00" },
        { day: 3, start: "07:00", end: "11:00" },
        { day: 3, start: "14:00", end: "18:00" },
      ],
      // ter, qui, sab — manhã
      [
        { day: 2, start: "08:00", end: "13:00" },
        { day: 4, start: "08:00", end: "13:00" },
        { day: 6, start: "08:00", end: "13:00" },
      ],
      // dom, sab — fim de semana
      [
        { day: 0, start: "10:00", end: "15:00" },
        { day: 6, start: "10:00", end: "15:00" },
      ],
    ];

    const rows = [];
    services.forEach((svc, index) => {
      const pattern = patterns[index % patterns.length];
      pattern.forEach(({ day, start, end }) => {
        rows.push({
          service_id: svc.id,
          day_of_week: day,
          start_time: start,
          end_time: end,
          created_at: now,
          updated_at: now,
        });
      });
    });

    await queryInterface.bulkInsert("service_availability", rows);
  },

  async down(queryInterface, Sequelize) {
    const services = await queryInterface.sequelize.query(
      `SELECT id FROM service ORDER BY id LIMIT 7`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (services.length === 0) return;

    const ids = services.map((s) => s.id);
    await queryInterface.bulkDelete(
      "service_availability",
      { service_id: ids },
      {},
    );
  },
};
