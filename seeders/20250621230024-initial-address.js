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
    await queryInterface.bulkInsert("address", [
      {
        user_id: userIds[0],
        lat: -23.55052,
        lng: -46.633308,
        street: "Rua A",
        number: "123",
        complement: "Apto 1",
        neighborhood: "Bairro A",
        city: "Cidade A",
        state: "SP",
        country_iso: "BR",
        postal_code: "12345678",
      },
      {
        user_id: userIds[1],
        lat: -22.906847,
        lng: -43.172896,
        street: "Rua B",
        number: "456",
        complement: "Casa 2",
        neighborhood: "Bairro B",
        city: "Cidade B",
        state: "RJ",
        country_iso: "BR",
        postal_code: "23456789",
      },
      {
        user_id: userIds[2],
        lat: -19.916681,
        lng: -43.934493,
        street: "Rua C",
        number: "789",
        complement: "",
        neighborhood: "Bairro C",
        city: "Cidade C",
        state: "MG",
        country_iso: "BR",
        postal_code: "34567890",
      },
      {
        user_id: userIds[3],
        lat: -30.034647,
        lng: -51.217658,
        street: "Rua D",
        number: "101112",
        complement: "",
        neighborhood: "Bairro D",
        city: "Cidade D",
        state: "RS",
        country_iso: "BR",
        postal_code: "45678901",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("address", null, {});
  },
};
