"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("subcategory", [
      {
        title: "Manicure",
        description: "Manicure e pedicure a domicílio.",
        active: true,
        category_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Cabeleireiro",
        description: "Cortes, penteados e coloração.",
        active: true,
        category_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Eletricista",
        description: "Instalações e reparos elétricos.",
        active: true,
        category_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Encanador",
        description: "Reparos hidráulicos e encanamento.",
        active: true,
        category_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Massoterapia",
        description: "Massagens terapêuticas e relaxantes.",
        active: true,
        category_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

async down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('service', null, {});

  await queryInterface.bulkDelete('subcategory', null, {});
}
};
