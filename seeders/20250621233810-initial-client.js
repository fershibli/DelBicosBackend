"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // get user ids
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE name IN ('Fernando', 'Isabel', 'Douglas', 'Gustavo')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map((user) => user.id);
    // get address ids
    const addresses = await queryInterface.sequelize.query(
      `SELECT id FROM address WHERE user_id IN (${userIds.join(",")})`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const addressIds = addresses.map((address) => address.id);
    // fake CPFs
    const cpfs = [
      "53898278999",
      "18869131459",
      "39077794018",
      "57509247772",
      "08069989971",
    ];
    const clients = userIds.map((userId, index) => ({
      user_id: userId,
      main_address_id: addressIds[index],
      cpf: cpfs[index],
    }));
    await queryInterface.bulkInsert("clients", clients);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("clients", null, {});
  },
};
