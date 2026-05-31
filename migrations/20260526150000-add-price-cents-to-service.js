"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("service", "price_cents", {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: "Preço em centavos (inteiro). Tem precedência sobre price.",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("service", "price_cents");
  },
};
