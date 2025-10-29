"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("appointment", "payment_intent_id", {
      type: Sequelize.STRING,
      allowNull: true, // Permite nulo (para agendamentos futuros ou testes)
      unique: true, // Garante que um pagamento só seja usado para um agendamento
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("appointment", "payment_intent_id");
  },
};
