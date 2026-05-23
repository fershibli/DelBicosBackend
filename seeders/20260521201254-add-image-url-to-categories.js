"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Mapeamento dos links de imagem para cada título de categoria correspondente
    const categoryImages = [
      {
        title: "Saúde & Bem-Estar",
        image_url: "https://delbicos-assets.s3.us-east-1.amazonaws.com/saude-e-bem-estar.png",
      },
      {
        title: "Beleza & Estética",
        image_url: "https://delbicos-assets.s3.us-east-1.amazonaws.com/beleza-e-estetica.png",
      },
      {
        title: "Reformas & Reparos",
        image_url: "https://delbicos-assets.s3.us-east-1.amazonaws.com/reparos-e-reformas.png",
      },
      {
        title: "Serviços Gerais",
        image_url: "https://delbicos-assets.s3.us-east-1.amazonaws.com/servicos-gerais.png",
      },
      {
        title: "Serviços Domésticos",
        image_url: "https://delbicos-assets.s3.us-east-1.amazonaws.com/servicos-domesticos.png",
      },
      {
        title: "Pet",
        image_url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop",
      },
    ];

    // Atualiza linha por linha baseado no título exato
    for (const category of categoryImages) {
      await queryInterface.bulkUpdate(
        "category",
        { 
          image_url: category.image_url,
          updated_at: new Date()
        },
        { title: category.title }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Caso precise dar undo nessa seed específica, ela limpa os campos de imagem
    await queryInterface.bulkUpdate(
      "category",
      { image_url: null },
      {
        title: [
          "Saúde & Bem-Estar",
          "Beleza & Estética",
          "Reformas & Reparos",
          "Serviços Gerais",
          "Serviços Domésticos",
          "Pet",
        ],
      }
    );
  },
};