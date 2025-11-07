"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const now = new Date();
    await queryInterface.bulkInsert("users", [
      {
        name: "Fernando Rasmut",
        email: "fernando@delbicos.com.br",
        phone: "5515998765432",
        password: await bcrypt.hash("1234", salt),
        avatar_uri: "https://i.pravatar.cc/150?img=1",
        banner_uri: "https://picsum.photos/seed/fernando/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Isabel Rodrigues",
        email: "isabel@delbicos.com.br",
        phone: "5515997654321",
        password: await bcrypt.hash("1234", salt),
        avatar_uri: "https://i.pravatar.cc/150?img=2",
        banner_uri: "https://picsum.photos/seed/isabel/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Douglas Ferreira",
        email: "douglas@delbicos.com.br",
        phone: "5515996543210",
        password: await bcrypt.hash("1234", salt),
        avatar_uri: "https://i.pravatar.cc/150?img=3",
        banner_uri: "https://picsum.photos/seed/douglas/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Gustavo Mendes",
        email: "gustavo@delbicos.com.br",
        phone: "5515995432109",
        password: await bcrypt.hash("1234", salt),
        avatar_uri: "https://i.pravatar.cc/150?img=4",
        banner_uri: "https://picsum.photos/seed/gustavo/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Eduardo Souza",
        email: "eduardo@delbicos.com.br",
        phone: "5515994321098",
        password: await bcrypt.hash("1234", salt),
        avatar_uri: "https://i.pravatar.cc/150?img=5",
        banner_uri: "https://picsum.photos/seed/eduardo/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Iago Silva",
        email: "iago@delbicos.com.br",
        phone: "5515993210987",
        password: await bcrypt.hash("1234", salt),
        avatar_uri: "https://i.pravatar.cc/150?img=6",
        banner_uri: "https://picsum.photos/seed/iago/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Lucas Lima",
        email: "lucas@delbicos.com.br",
        phone: "5515992109876",
        password: await bcrypt.hash("1234", salt),
        avatar_uri: "https://i.pravatar.cc/150?img=7",
        banner_uri: "https://picsum.photos/seed/lucas/800/200",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
