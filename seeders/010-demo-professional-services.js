"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const subcategories = await queryInterface.sequelize.query(
      `SELECT id, title FROM subcategory`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const subcategoryMap = {};
    subcategories.forEach((sub) => {
      subcategoryMap[sub.title] = sub.id;
    });

    const professionals = await queryInterface.sequelize.query(
      `SELECT p.id, u.email 
       FROM professional p 
       INNER JOIN users u ON p.user_id = u.id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const professionalMap = {};
    professionals.forEach((prof) => {
      professionalMap[prof.email] = prof.id;
    });

    const now = new Date();
    const services = [];

    const addService = (
      email,
      subCategoryTitle,
      title,
      description,
      price,
      duration
    ) => {
      const profId = professionalMap[email];
      const subId = subcategoryMap[subCategoryTitle];

      if (profId && subId) {
        services.push({
          professional_id: profId,
          subcategory_id: subId,
          title,
          description,
          price,
          duration,
          active: true,
          created_at: now,
          updated_at: now,
        });
      } else {
        console.warn(
          `⚠️ Pulando serviço "${title}": Profissional (${email}) ou Subcategoria (${subCategoryTitle}) não encontrados.`
        );
      }
    };

    // Carlos Silva (Eletricista)
    addService(
      "carlos.silva@delbicos.com",
      "Eletricista",
      "Instalação Elétrica Completa",
      "Instalação elétrica completa...",
      180.0,
      240
    );
    addService(
      "carlos.silva@delbicos.com",
      "Eletricista",
      "Manutenção Preventiva",
      "Verificação e manutenção...",
      120.0,
      120
    );
    addService(
      "carlos.silva@delbicos.com",
      "Eletricista",
      "Troca de Disjuntores",
      "Substituição de disjuntores...",
      250.0,
      180
    );
    addService(
      "carlos.silva@delbicos.com",
      "Eletricista",
      "Instalação de Ventiladores",
      "Instalação profissional...",
      90.0,
      60
    );

    // Maria Fernanda (Diarista / Limpeza)
    addService(
      "maria.costa@delbicos.com",
      "Diarista",
      "Faxina Completa",
      "Limpeza completa de todos os cômodos...",
      150.0,
      240
    );
    addService(
      "maria.costa@delbicos.com",
      "Diarista",
      "Limpeza Pesada",
      "Limpeza profunda...",
      200.0,
      360
    );
    addService(
      "maria.costa@delbicos.com",
      "Vidraceiro",
      "Limpeza de Vidros",
      "Limpeza especializada...",
      80.0,
      120
    );
    addService(
      "maria.costa@delbicos.com",
      "Personal Organizer",
      "Organização de Ambientes",
      "Organização de armários...",
      120.0,
      180
    );

    // João Pedro (Encanador)
    addService(
      "joao.oliveira@delbicos.com",
      "Encanador",
      "Desentupimento de Pias",
      "Desentupimento profissional...",
      100.0,
      60
    );
    addService(
      "joao.oliveira@delbicos.com",
      "Encanador",
      "Conserto de Vazamentos",
      "Identificação e reparo...",
      120.0,
      120
    );
    addService(
      "joao.oliveira@delbicos.com",
      "Gás & Água",
      "Instalação de Aquecedor",
      "Instalação completa...",
      280.0,
      240
    );
    addService(
      "joao.oliveira@delbicos.com",
      "Gás & Água",
      "Manutenção de Gás",
      "Verificação preventiva...",
      150.0,
      120
    );

    // Ana Paula (Designer de Interiores)
    addService(
      "ana.rodrigues@delbicos.com",
      "Designer de Interiores",
      "Consultoria de Decoração",
      "Consultoria personalizada...",
      200.0,
      120
    );
    addService(
      "ana.rodrigues@delbicos.com",
      "Designer de Interiores",
      "Projeto 3D",
      "Desenvolvimento de projeto...",
      350.0,
      300
    );
    addService(
      "ana.rodrigues@delbicos.com",
      "Personal Organizer",
      "Personal Shopper Decor",
      "Acompanhamento em lojas...",
      180.0,
      180
    );

    // Ricardo Almeida (Pedreiro)
    addService(
      "ricardo.souza@delbicos.com",
      "Pedreiro",
      "Construção de Muros",
      "Construção de alvenaria...",
      300.0,
      480
    );
    addService(
      "ricardo.souza@delbicos.com",
      "Pedreiro",
      "Reboco e Emboço",
      "Aplicação de reboco...",
      220.0,
      360
    );
    addService(
      "ricardo.souza@delbicos.com",
      "Pedreiro",
      "Pisos e Azulejos",
      "Instalação profissional...",
      180.0,
      240
    );
    addService(
      "ricardo.souza@delbicos.com",
      "Pedreiro",
      "Reforma de Banheiro",
      "Reforma completa...",
      450.0,
      600
    );
    addService(
      "ricardo.souza@delbicos.com",
      "Limpeza pós Obra",
      "Limpeza Pós Reforma",
      "Remoção de entulhos...",
      180.0,
      240
    );

    // Patricia Lima (Manicure)
    addService(
      "patricia.lima@delbicos.com",
      "Manicure",
      "Manicure Completa",
      "Cutilagem e esmaltação...",
      45.0,
      60
    );
    addService(
      "patricia.lima@delbicos.com",
      "Manicure",
      "Pedicure Completa",
      "Cutilagem e lixamento...",
      50.0,
      60
    );
    addService(
      "patricia.lima@delbicos.com",
      "Manicure",
      "Unhas de Gel",
      "Alongamento...",
      120.0,
      120
    );
    addService(
      "patricia.lima@delbicos.com",
      "Manicure",
      "Spa de Pés e Mãos",
      "Hidratação profunda...",
      90.0,
      90
    );

    // Fernando Henrique (Jardineiro)
    addService(
      "fernando.dias@delbicos.com",
      "Jardineiro",
      "Manutenção de Jardim",
      "Poda e limpeza...",
      120.0,
      180
    );
    addService(
      "fernando.dias@delbicos.com",
      "Jardineiro",
      "Paisagismo",
      "Projeto e execução...",
      350.0,
      480
    );

    // Juliana Martins (Personal Organizer)
    addService(
      "juliana.martins@delbicos.com",
      "Personal Organizer",
      "Organização de Armários",
      "Organização completa...",
      150.0,
      180
    );
    addService(
      "juliana.martins@delbicos.com",
      "Personal Organizer",
      "Organização de Cozinha",
      "Otimização de espaços...",
      180.0,
      240
    );

    if (services.length > 0) {
      await queryInterface.bulkInsert("service", services);
    } else {
      console.warn(
        "⚠️ Nenhum serviço foi criado. Verifique se as subcategorias e usuários existem."
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const professionals = await queryInterface.sequelize.query(
      `SELECT id FROM professional p 
       INNER JOIN users u ON p.user_id = u.id 
       WHERE u.email IN (
         'carlos.silva@delbicos.com', 'maria.costa@delbicos.com', 
         'joao.oliveira@delbicos.com', 'ana.rodrigues@delbicos.com', 
         'ricardo.souza@delbicos.com', 'patricia.lima@delbicos.com', 
         'fernando.dias@delbicos.com', 'juliana.martins@delbicos.com'
       )`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (professionals.length > 0) {
      const ids = professionals.map((p) => p.id);
      await queryInterface.bulkDelete("service", { professional_id: ids });
    }
  },
};
