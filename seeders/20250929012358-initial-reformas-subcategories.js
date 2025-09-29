"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Buscar o ID da categoria "Reformas & Reparos"
    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM category WHERE title = 'Reformas & Reparos'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (categories.length === 0) {
      throw new Error('Categoria "Reformas & Reparos" não encontrada');
    }

    const categoryId = categories[0].id;

    await queryInterface.bulkInsert("subcategory", [
      {
        title: "Chaveiro",
        description:
          "Serviços de chaveiro, cópias de chaves, abertura de fechaduras",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Eletricista",
        description:
          "Instalações e reparos elétricos, manutenção de sistemas elétricos",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Encanador",
        description: "Instalações e reparos hidráulicos, desentupimentos",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Gás & Água",
        description: "Instalação e manutenção de sistemas de gás e água",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Limpeza pós Obra",
        description: "Limpeza especializada após reformas e construções",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Marido de Aluguel",
        description:
          "Serviços gerais de manutenção e pequenos reparos domésticos",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Marceneiro",
        description:
          "Serviços de marcenaria, móveis sob medida, reparos em madeira",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Pedreiro",
        description: "Serviços de construção, alvenaria, reformas estruturais",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Pintor",
        description: "Pintura residencial e comercial, acabamentos",
        category_id: categoryId,
        active: true,
      },
      {
        title: "Vidraceiro",
        description: "Instalação e reparo de vidros, espelhos e esquadrias",
        category_id: categoryId,
        active: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Buscar o ID da categoria "Reformas & Reparos" para reverter
    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM category WHERE title = 'Reformas & Reparos'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (categories.length > 0) {
      const categoryId = categories[0].id;
      await queryInterface.bulkDelete(
        "subcategory",
        {
          category_id: categoryId,
        },
        {}
      );
    }
  },
};
