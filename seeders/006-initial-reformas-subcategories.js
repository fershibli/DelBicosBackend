"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      `SELECT id, title FROM category`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.title] = cat.id;
      return acc;
    }, {});

    const requiredCategories = [
      "Reformas & Reparos",
      "Serviços Domésticos",
      "Beleza & Estética",
      "Serviços Gerais",
      "Saúde & Bem-Estar",
      "Pet",
    ];

    const missingCategories = requiredCategories.filter((c) => !categoryMap[c]);
    if (missingCategories.length > 0) {
      throw new Error(
        `Categorias principais faltando: ${missingCategories.join(
          ", "
        )}. Rode o seeder 001 primeiro.`
      );
    }

    const now = new Date();

    const allSubcategories = [
      // --- Reformas & Reparos ---
      { title: "Chaveiro", cat: "Reformas & Reparos" },
      { title: "Eletricista", cat: "Reformas & Reparos" },
      { title: "Encanador", cat: "Reformas & Reparos" },
      { title: "Gás & Água", cat: "Reformas & Reparos" },
      { title: "Limpeza pós Obra", cat: "Reformas & Reparos" },
      { title: "Marido de Aluguel", cat: "Reformas & Reparos" },
      { title: "Designer de Interiores", cat: "Reformas & Reparos" },
      { title: "Marceneiro", cat: "Reformas & Reparos" },
      { title: "Pedreiro", cat: "Reformas & Reparos" },
      { title: "Pintor", cat: "Reformas & Reparos" },
      { title: "Vidraceiro", cat: "Reformas & Reparos" },
      { title: "Serralheiro", cat: "Reformas & Reparos" },
      { title: "Gesseiro", cat: "Reformas & Reparos" },

      // --- Serviços Domésticos ---
      { title: "Babá", cat: "Serviços Domésticos" },
      { title: "Cozinheira", cat: "Serviços Domésticos" },
      { title: "Diarista", cat: "Serviços Domésticos" },
      { title: "Jardineiro", cat: "Serviços Domésticos" },
      { title: "Lavadeira", cat: "Serviços Domésticos" },
      { title: "Limpeza de sofá", cat: "Serviços Domésticos" },
      { title: "Passadeira", cat: "Serviços Domésticos" },
      { title: "Personal Organizer", cat: "Serviços Domésticos" },
      { title: "Sanitização de Ambientes", cat: "Serviços Domésticos" },
      { title: "Piscineiro", cat: "Serviços Domésticos" },

      // --- Beleza & Estética ---
      { title: "Cabelo & Barba", cat: "Beleza & Estética" },
      { title: "Manicure & Pedicure", cat: "Beleza & Estética" },
      { title: "Maquiagem", cat: "Beleza & Estética" },
      { title: "Depilação", cat: "Beleza & Estética" },
      { title: "Esteticista", cat: "Beleza & Estética" },
      { title: "Micropigmentação", cat: "Beleza & Estética" },
      { title: "Podologia", cat: "Beleza & Estética" },
      { title: "Design de Sobrancelhas", cat: "Beleza & Estética" },
      { title: "Massagem Modeladora", cat: "Beleza & Estética" },

      // --- Serviços Gerais ---
      { title: "Corte & Costura", cat: "Serviços Gerais" },
      { title: "Sapateiro", cat: "Serviços Gerais" },
      { title: "Desentupidor", cat: "Serviços Gerais" },
      { title: "Mudanças & Carretos", cat: "Serviços Gerais" },
      { title: "Recepcionista", cat: "Serviços Gerais" },
      { title: "Fotógrafo", cat: "Serviços Gerais" },
      { title: "Animador de Festa", cat: "Serviços Gerais" },
      { title: "Motorista", cat: "Serviços Gerais" },
      { title: "Montador de Móveis", cat: "Serviços Gerais" },
      { title: "Dedetizador", cat: "Serviços Gerais" },

      // --- Saúde & Bem-Estar ---
      { title: "Enfermeiro(a)", cat: "Saúde & Bem-Estar" },
      { title: "Psicólogo(a)", cat: "Saúde & Bem-Estar" },
      { title: "Cuidador de Idoso", cat: "Saúde & Bem-Estar" },
      { title: "Terapeuta Ocupacional", cat: "Saúde & Bem-Estar" },
      { title: "Doula", cat: "Saúde & Bem-Estar" },
      { title: "Massoterapeuta", cat: "Saúde & Bem-Estar" },
      { title: "Nutricionista", cat: "Saúde & Bem-Estar" },
      { title: "Fonoaudiólogo(a)", cat: "Saúde & Bem-Estar" },
      { title: "Personal Trainer", cat: "Saúde & Bem-Estar" },

      // --- Pets ---
      { title: "Pet Sitter", cat: "Pet" },
      { title: "Dog Walker", cat: "Pet" },
      { title: "Veterinário", cat: "Pet" },
      { title: "Creche & Hotel", cat: "Pet" },
      { title: "Banho & Tosa", cat: "Pet" },
      { title: "Adestrador", cat: "Pet" },
    ];

    const subcategoriesToInsert = allSubcategories
      .filter((sub) => categoryMap[sub.cat])
      .map((sub) => ({
        title: sub.title,
        category_id: categoryMap[sub.cat],
        description: `Serviços profissionais de ${sub.title}`,
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
