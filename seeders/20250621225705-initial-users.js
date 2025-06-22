"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const currentDate = new Date();
    await queryInterface.bulkInsert("users", [
      {
        name: "Fernando",
        email: "fernando@delbicos.com.br",
        phone: "5511999999999",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Isabel",
        email: "isabel@delbicos.com.br",
        phone: "5511988888888",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Douglas",
        email: "douglas@delbicos.com.br",
        phone: "5511977777777",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Gustavo",
        email: "gustavo@delbicos.com.br",
        phone: "5511966666666",
        password: await bcrypt.hash("1234", salt),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
