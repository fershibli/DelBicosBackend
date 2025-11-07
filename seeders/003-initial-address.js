"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id, name FROM users ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map((user) => user.id);
    const now = new Date();

    await queryInterface.bulkInsert("address", [
      {
        user_id: userIds[0], // Fernando
        lat: -23.5394,
        lng: -47.4434,
        street: "Avenida Antônio Carlos Pinto de Almeida",
        number: "850",
        complement: "Casa",
        neighborhood: "Vila Santa Maria",
        city: "Votorantim",
        state: "SP",
        country_iso: "BR",
        postal_code: "18110340",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userIds[1], // Isabel
        lat: -23.5015,
        lng: -47.4586,
        street: "Rua Professor Toledo",
        number: "275",
        complement: "Apto 302",
        neighborhood: "Centro",
        city: "Sorocaba",
        state: "SP",
        country_iso: "BR",
        postal_code: "18035380",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userIds[2], // Douglas
        lat: -23.5305,
        lng: -47.4393,
        street: "Rua Florêncio Gomes de Oliveira",
        number: "125",
        complement: "",
        neighborhood: "Jardim Paulista",
        city: "Votorantim",
        state: "SP",
        country_iso: "BR",
        postal_code: "18110470",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userIds[3], // Gustavo
        lat: -23.4967,
        lng: -47.4421,
        street: "Avenida General Carneiro",
        number: "1890",
        complement: "Sala 10",
        neighborhood: "Jardim Faculdade",
        city: "Sorocaba",
        state: "SP",
        country_iso: "BR",
        postal_code: "18030230",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userIds[4], // Eduardo
        lat: -23.5448,
        lng: -47.4522,
        street: "Rua José Raimundo dos Santos",
        number: "450",
        complement: "Fundos",
        neighborhood: "Parque Bela Vista",
        city: "Votorantim",
        state: "SP",
        country_iso: "BR",
        postal_code: "18110560",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userIds[5], // Iago
        lat: -23.5178,
        lng: -47.4732,
        street: "Rua Comendador Oetterer",
        number: "698",
        complement: "Apto 501 Bloco B",
        neighborhood: "Campolim",
        city: "Sorocaba",
        state: "SP",
        country_iso: "BR",
        postal_code: "18047320",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userIds[6], // Lucas
        lat: -23.5267,
        lng: -47.4288,
        street: "Rua Nove de Julho",
        number: "1320",
        complement: "Casa 2",
        neighborhood: "Centro",
        city: "Votorantim",
        state: "SP",
        country_iso: "BR",
        postal_code: "18110005",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("address", null, {});
  },
};
