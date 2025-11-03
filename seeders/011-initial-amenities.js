"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("amenities", [
      {
        title: "Frete grátis",
        description: "Serviço com entrega gratuita.",
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        title: "Atendimento em Libras",
        description: "Profissionais capacitados em linguagem de sinais.",
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        title: "Frete rápido",
        description: "Entrega em até 2 horas na sua região.",
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        title: "Serviço noturno",
        description: "Atendimento após as 18h.",
        active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("amenities", null, {});
  },
};
