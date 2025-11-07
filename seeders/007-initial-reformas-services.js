"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const professionals = await queryInterface.sequelize.query(
      `SELECT id FROM professional ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const professionalIds = professionals.map((prof) => prof.id);

    const subcategories = await queryInterface.sequelize.query(
      `SELECT s.id, s.title FROM subcategory s 
       JOIN category c ON s.category_id = c.id 
       WHERE c.title = 'Reformas & Reparos'
       ORDER BY s.title`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const subcategoryMap = subcategories.reduce((acc, sub) => {
      acc[sub.title] = sub.id;
      return acc;
    }, {});

    const predefinedServices = [
      {
        title: "Abertura de Fechaduras",
        price: 80.0,
        duration: 30,
        sub: "Chaveiro",
      },
      {
        title: "Instalação de Tomadas",
        price: 50.0,
        duration: 45,
        sub: "Eletricista",
      },
      {
        title: "Desentupimento de Pia",
        price: 100.0,
        duration: 60,
        sub: "Encanador",
      },
      {
        title: "Instalação de Aquecedor a Gás",
        price: 200.0,
        duration: 120,
        sub: "Gás & Água",
      },
      {
        title: "Limpeza Completa pós Reforma",
        price: 300.0,
        duration: 240,
        sub: "Limpeza pós Obra",
      },
      {
        title: "Montagem de Móveis",
        price: 80.0,
        duration: 120,
        sub: "Marido de Aluguel",
      },
      {
        title: "Móveis sob Medida",
        price: 500.0,
        duration: 480,
        sub: "Marceneiro",
      },
    ];
    const now = new Date();
    const services = [];

    professionalIds.forEach((professionalId, index) => {
      if (index < predefinedServices.length) {
        const serviceData = predefinedServices[index];
        const subcategoryId = subcategoryMap[serviceData.sub];

        if (subcategoryMap[serviceData.sub]) {
          services.push({
            title: serviceData.title,
            description: `Serviço profissional de ${serviceData.sub} com qualidade garantida`,
            price: serviceData.price,
            duration: serviceData.duration,
            active: true,
            subcategory_id: subcategoryId,
            professional_id: professionalId,
            banner_uri: `https://picsum.photos/seed/${professionalId}/400/200`,
            created_at: now,
            updated_at: now,
          });
        }
      }
    });

    await queryInterface.bulkInsert("service", services);
  },

  async down(queryInterface, Sequelize) {
    const professionals = await queryInterface.sequelize.query(
      `SELECT id FROM professional`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (professionals.length > 0) {
      const professionalIds = professionals.map((prof) => prof.id);
      await queryInterface.bulkDelete(
        "service",
        {
          professional_id: professionalIds,
        },
        {}
      );
    }
  },
};
