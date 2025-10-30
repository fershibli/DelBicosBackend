"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("amenities", [
      {
        title: "Frete grátis",
        description: "Serviço com entrega gratuita.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Atendimento em Libras",
        description: "Profissionais capacitados em linguagem de sinais.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Frete rápido",
        description: "Entrega em até 2 horas na sua região.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Serviço noturno",
        description: "Atendimento após as 18h.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("amenities", null, {});
  },
};
