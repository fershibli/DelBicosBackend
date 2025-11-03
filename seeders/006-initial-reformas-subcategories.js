"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Buscar todas as categorias
    const categories = await queryInterface.sequelize.query(
      `SELECT id, title FROM category`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.title] = cat.id;
      return acc;
    }, {});

    if (!categoryMap["Reformas & Reparos"]) {
      throw new Error(
        "Categorias principais não encontradas. Rode o seeder 001 primeiro."
      );
    }

    const now = new Date();
    const allSubcategories = [
      { title: "Chaveiro", category_id: categoryMap["Reformas & Reparos"] },
      { title: "Eletricista", category_id: categoryMap["Reformas & Reparos"] },
      { title: "Encanador", category_id: categoryMap["Reformas & Reparos"] },
      { title: "Gás & Água", category_id: categoryMap["Reformas & Reparos"] },
      {
        title: "Limpeza pós Obra",
        category_id: categoryMap["Reformas & Reparos"],
      },
      {
        title: "Marido de Aluguel",
        category_id: categoryMap["Reformas & Reparos"],
      },
      { title: "Marceneiro", category_id: categoryMap["Reformas & Reparos"] },
      { title: "Pedreiro", category_id: categoryMap["Reformas & Reparos"] },
      { title: "Pintor", category_id: categoryMap["Reformas & Reparos"] },
      { title: "Vidraceiro", category_id: categoryMap["Reformas & Reparos"] },

      { title: "Diarista", category_id: categoryMap["Serviços Domésticos"] },
      { title: "Jardineiro", category_id: categoryMap["Serviços Domésticos"] },
      {
        title: "Personal Organizer",
        category_id: categoryMap["Serviços Domésticos"],
      },

      { title: "Manicure", category_id: categoryMap["Beleza & Estética"] },
      {
        title: "Cabeleireiro(a)",
        category_id: categoryMap["Beleza & Estética"],
      },

      {
        title: "Designer de Interiores",
        category_id: categoryMap["Serviços Gerais"],
      },
    ];

    const subcategoriesToInsert = allSubcategories
      .filter((sub) => sub.category_id)
      .map((sub) => ({
        ...sub,
        description: `Serviços de ${sub.title}`,
        active: true,
        created_at: now,
        updated_at: now,
      }));

    await queryInterface.bulkInsert("subcategory", subcategoriesToInsert);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subcategory", null, {});
  },
};
