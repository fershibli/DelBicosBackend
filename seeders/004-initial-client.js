"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map((user) => user.id);

    const addresses = await queryInterface.sequelize.query(
      `SELECT id, user_id FROM address ORDER BY user_id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const addressMap = addresses.reduce((acc, addr) => {
      acc[addr.user_id] = addr.id;
      return acc;
    }, {});

    const cpfs = [
      "12345678909",
      "98765432100",
      "45678912345",
      "78912345678",
      "32165498732",
      "65498732165",
      "14725836914",
    ];
    const now = new Date();

    const clients = userIds.map((userId, index) => ({
      user_id: userId,
      main_address_id: addressMap[userId],
      cpf: cpfs[index],
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert("client", clients);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("client", null, {});
  },
};
