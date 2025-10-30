"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("category", [
      {
        title: "Beleza & Estética",
        description: "Serviços de beleza como manicure, pedicure, cabeleireiro, etc.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Serviços Gerais",
        description: "Serviços domésticos, manutenção e reparos.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Saúde & Bem-estar",
        description: "Fisioterapia, massagem, enfermagem, e outros cuidados.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("category", null, {});
  },
};
