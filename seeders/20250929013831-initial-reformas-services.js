"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Buscar IDs dos profissionais
    const professionals = await queryInterface.sequelize.query(
      `SELECT id FROM professional ORDER BY id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (professionals.length === 0) {
      throw new Error("Nenhum profissional encontrado");
    }

    const professionalIds = professionals.map((prof) => prof.id);

    // Buscar IDs das subcategorias de "Reformas & Reparos"
    const subcategories = await queryInterface.sequelize.query(
      `SELECT s.id, s.title FROM subcategory s 
       JOIN category c ON s.category_id = c.id 
       WHERE c.title = 'Reformas & Reparos' AND s.active = true
       ORDER BY s.title`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (subcategories.length === 0) {
      throw new Error(
        'Nenhuma subcategoria de "Reformas & Reparos" encontrada'
      );
    }

    // Lista fixa de 7 serviços - um para cada profissional
    const predefinedServices = [
      {
        title: "Abertura de Fechaduras",
        description: "Serviço profissional de chaveiro com qualidade garantida",
        price: 80.0,
        duration: 30,
        subcategory_title: "Chaveiro",
      },
      {
        title: "Instalação de Tomadas",
        description:
          "Serviço profissional de eletricista com qualidade garantida",
        price: 50.0,
        duration: 45,
        subcategory_title: "Eletricista",
      },
      {
        title: "Desentupimento de Pia",
        description:
          "Serviço profissional de encanador com qualidade garantida",
        price: 100.0,
        duration: 60,
        subcategory_title: "Encanador",
      },
      {
        title: "Instalação de Aquecedor a Gás",
        description:
          "Serviço profissional de gás & água com qualidade garantida",
        price: 200.0,
        duration: 120,
        subcategory_title: "Gás & Água",
      },
      {
        title: "Limpeza Completa pós Reforma",
        description:
          "Serviço profissional de limpeza pós obra com qualidade garantida",
        price: 300.0,
        duration: 240,
        subcategory_title: "Limpeza pós Obra",
      },
      {
        title: "Montagem de Móveis",
        description:
          "Serviço profissional de marido de aluguel com qualidade garantida",
        price: 80.0,
        duration: 120,
        subcategory_title: "Marido de Aluguel",
      },
      {
        title: "Móveis sob Medida",
        description:
          "Serviço profissional de marceneiro com qualidade garantida",
        price: 500.0,
        duration: 480,
        subcategory_title: "Marceneiro",
      },
    ];

    const services = [];

    // Para cada profissional (assumindo que temos 7), criar um serviço da lista
    professionalIds.forEach((professionalId, index) => {
      if (index < predefinedServices.length) {
        const serviceData = predefinedServices[index];

        // Encontrar a subcategoria correspondente
        const subcategory = subcategories.find(
          (sub) => sub.title === serviceData.subcategory_title
        );

        if (subcategory) {
          services.push({
            title: serviceData.title,
            description: serviceData.description,
            price: serviceData.price,
            duration: serviceData.duration,
            active: true,
            subcategory_id: subcategory.id,
            professional_id: professionalId,
          });
        }
      }
    });

    await queryInterface.bulkInsert("service", services);
  },

  async down(queryInterface, Sequelize) {
    // Buscar IDs dos profissionais para reverter
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
