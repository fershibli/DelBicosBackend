"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("category", [
      {
        title: "Saúde & Bem-Estar",
        description: "Serviços relacionados à saúde e bem-estar.",
        created_at: now,
        updated_at: now,
      },
      {
        title: "Beleza & Estética",
        description: "Serviços de beleza e estética.",
        created_at: now,
        updated_at: now,
      },
      {
        title: "Reformas & Reparos",
        description: "Serviços de reformas e reparos em casa.",
        created_at: now,
        updated_at: now,
      },
      {
        title: "Serviços Gerais",
        description: "Serviços diversos para o dia a dia.",
        created_at: now,
        updated_at: now,
      },
      {
        title: "Serviços Domésticos",
        description: "Serviços relacionados a tarefas domésticas.",
        created_at: now,
        updated_at: now,
      },
      {
        title: "Pet",
        description: "Serviços relacionados a animais de estimação.",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("category", null, {});
  },
};
