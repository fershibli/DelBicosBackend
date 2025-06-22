"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("category", [
      {
        title: "Saúde & Bem-Estar",
        description: "Serviços relacionados à saúde e bem-estar.",
      },
      {
        title: "Beleza & Estética",
        description: "Serviços de beleza e estética.",
      },
      {
        title: "Reformas & Reparos",
        description: "Serviços de reformas e reparos em casa.",
      },
      {
        title: "Serviços Gerais",
        description: "Serviços diversos para o dia a dia.",
      },
      {
        title: "Serviços Domésticos",
        description: "Serviços relacionados a tarefas domésticas.",
      },
      {
        title: "Pet",
        description: "Serviços relacionados a animais de estimação.",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("category", null, {});
  },
};
