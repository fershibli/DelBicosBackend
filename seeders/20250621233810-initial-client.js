"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // get user ids
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE name IN ('Fernando Rasmut', 'Isabel Rodrigues', 'Douglas Ferreira', 'Gustavo Mendes', 'Eduardo Souza', 'Iago Silva', 'Lucas Lima')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map((user) => user.id);
    // get address ids
    const addresses = await queryInterface.sequelize.query(
      `SELECT id FROM address WHERE user_id IN (${userIds.join(",")})`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const addressIds = addresses.map((address) => address.id);
    // CPFs válidos (formato válido para algoritmo de validação)
    const cpfs = [
      "12345678909",
      "98765432100",
      "45678912345",
      "78912345678",
      "32165498732",
      "65498732165",
      "14725836914",
    ];
    const clients = userIds.map((userId, index) => ({
      user_id: userId,
      main_address_id: addressIds[index],
      cpf: cpfs[index],
    }));
    await queryInterface.bulkInsert("client", clients);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("client", null, {});
  },
};
