"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    await queryInterface.bulkInsert("users", [
      {
        name: "Fernando Rasmut",
        email: "fernando.rasmut@delbicos.com.br",
        phone: "5515998765432",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Isabel Rodrigues",
        email: "isabel.rodrigues@delbicos.com.br",
        phone: "5515997654321",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Douglas Ferreira",
        email: "douglas.ferreira@delbicos.com.br",
        phone: "5515996543210",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Gustavo Mendes",
        email: "gustavo.mendes@delbicos.com.br",
        phone: "5515995432109",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Eduardo Souza",
        email: "eduardo.souza@delbicos.com.br",
        phone: "5515994321098",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Iago Silva",
        email: "iago.silva@delbicos.com.br",
        phone: "5515993210987",
        password: await bcrypt.hash("1234", salt),
      },
      {
        name: "Lucas Lima",
        email: "lucas.lima@delbicos.com.br",
        phone: "5515992109876",
        password: await bcrypt.hash("1234", salt),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
