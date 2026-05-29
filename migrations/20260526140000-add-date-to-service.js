"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("service", "date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
      comment: "Data de disponibilidade ou vigência do serviço",
      after: "duration", // ignorado pelo Postgres, funciona no MySQL
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("service", "date");
  },
};
