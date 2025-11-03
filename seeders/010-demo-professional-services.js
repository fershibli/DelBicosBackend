"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      `SELECT id, title FROM category`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.title] = cat.id;
    });

    const subcategories = await queryInterface.sequelize.query(
      `SELECT id, title, category_id FROM subcategory`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const subcategoryMap = {};
    subcategories.forEach((sub) => {
      subcategoryMap[sub.title] = sub.id;
    });

    const professionals = await queryInterface.sequelize.query(
      `SELECT p.id, u.email, u.name 
       FROM professional p 
       INNER JOIN users u ON p.user_id = u.id 
       WHERE u.email IN (
         'carlos.silva@delbicos.com',
         'maria.costa@delbicos.com',
         'joao.oliveira@delbicos.com',
         'ana.rodrigues@delbicos.com',
         'ricardo.souza@delbicos.com',
         'patricia.lima@delbicos.com',
         'fernando.dias@delbicos.com',
         'juliana.martins@delbicos.com'
       )`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const professionalMap = {};
    professionals.forEach((prof) => {
      professionalMap[prof.email] = prof.id;
    });
    const services = [];
    const now = new Date();

    if (professionalMap["carlos.silva@delbicos.com"]) {
      const profId = professionalMap["carlos.silva@delbicos.com"];
      const subcategoryId = subcategoryMap["Eletricista"];
      services.push(
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Instalação Elétrica Completa",
          description:
            "Instalação elétrica completa para residências e comércios, incluindo quadro de distribuição, tomadas, interruptores e iluminação.",
          price: 180.0,
          duration: 240,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Manutenção Preventiva Elétrica",
          description:
            "Verificação e manutenção preventiva de instalações elétricas, identificação de problemas e recomendações de melhorias.",
          price: 120.0,
          duration: 120,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Troca de Disjuntores e Quadro Elétrico",
          description:
            "Substituição de disjuntores antigos e modernização do quadro elétrico com componentes de qualidade.",
          price: 250.0,
          duration: 135,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Instalação de Ventiladores e Luminárias",
          description:
            "Instalação profissional de ventiladores de teto e luminárias decorativas.",
          price: 90.0,
          duration: 210,
          active: true,
          created_at: now,
          updated_at: now,
        }
      );
    }

    if (professionalMap["maria.costa@delbicos.com"]) {
      const profId = professionalMap["maria.costa@delbicos.com"];
      const subcategoryId = subcategoryMap["Diarista"] || null;

      services.push(
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Faxina Completa Residencial",
          description:
            "Limpeza completa de todos os cômodos, incluindo banheiros, cozinha, quartos e áreas comuns. Uso de produtos de qualidade.",
          price: 150.0,
          duration: 145,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Limpeza Pesada",
          description:
            "Limpeza profunda para imóveis que necessitam de cuidado especial, remoção de sujeira pesada e manchas difíceis.",
          price: 200.0,
          duration: 165,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Limpeza de Vidros e Janelas",
          description:
            "Limpeza especializada de vidros, janelas e espelhos, deixando tudo brilhando.",
          price: 80.0,
          duration: 125,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Organização de Ambientes",
          description:
            "Organização de armários, cozinha e ambientes diversos com técnicas profissionais.",
          price: 120.0,
          duration: 135,
          active: true,
          created_at: now,
          updated_at: now,
        }
      );
    }

    if (professionalMap["joao.oliveira@delbicos.com"]) {
      const profId = professionalMap["joao.oliveira@delbicos.com"];
      const subcategoryId = subcategoryMap["Encanador"];

      services.push(
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Desentupimento de Pias e Ralos",
          description:
            "Desentupimento profissional de pias, ralos e esgotos com equipamentos especializados.",
          price: 100.0,
          duration: 115,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Conserto de Vazamentos",
          description:
            "Identificação e reparo de vazamentos em tubulações, torneiras e registros.",
          price: 120.0,
          duration: 120,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Instalação de Aquecedor a Gás",
          description:
            "Instalação completa e segura de aquecedores a gás, incluindo tubulação e conexões.",
          price: 280.0,
          duration: 140,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryMap["Gás & Água"],
          title: "Manutenção de Sistema de Gás",
          description:
            "Verificação e manutenção preventiva de instalações de gás, teste de vazamentos e adequações.",
          price: 150.0,
          duration: 120,
          active: true,
          created_at: now,
          updated_at: now,
        }
      );
    }

    // Ana Paula - Designer de Interiores
    if (professionalMap["ana.rodrigues@delbicos.com"]) {
      const profId = professionalMap["ana.rodrigues@delbicos.com"];
      const subcategoryId = subcategoryMap["Designer de Interiores"] || null;

      services.push(
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Consultoria de Decoração",
          description:
            "Consultoria personalizada para decoração de ambientes, escolha de cores, móveis e acessórios.",
          price: 200.0,
          duration: 120,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Projeto de Ambientes 3D",
          description:
            "Desenvolvimento de projeto completo em 3D para visualização do ambiente antes da execução.",
          price: 350.0,
          duration: 155,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Personal Shopper de Decoração",
          description:
            "Acompanhamento em lojas para escolha de móveis, tecidos e objetos decorativos.",
          price: 180.0,
          duration: 135,
          active: true,
          created_at: now,
          updated_at: now,
        }
      );
    }

    // Ricardo Almeida - Pedreiro
    if (professionalMap["ricardo.souza@delbicos.com"]) {
      const profId = professionalMap["ricardo.souza@delbicos.com"];
      const subcategoryId = subcategoryMap["Pedreiro"];

      services.push(
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Construção de Muros e Paredes",
          description:
            "Construção de muros, paredes de alvenaria e divisórias com acabamento profissional.",
          price: 300.0,
          duration: 185,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Reboco e Emboço",
          description:
            "Aplicação de reboco e emboço em paredes e tetos, preparação para pintura.",
          price: 220.0,
          duration: 165,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Assentamento de Pisos e Azulejos",
          description:
            "Instalação profissional de pisos cerâmicos, porcelanatos e azulejos com acabamento perfeito.",
          price: 180.0,
          duration: 145,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Reforma de Banheiro",
          description:
            "Reforma completa de banheiros, incluindo alvenaria, hidráulica e acabamento.",
          price: 450.0,
          duration: 105,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryMap["Limpeza pós Obra"],
          title: "Limpeza Pós Reforma",
          description:
            "Limpeza especializada após reformas, remoção de entulhos e resíduos de obra.",
          price: 180.0,
          duration: 145,
          active: true,
          created_at: now,
          updated_at: now,
        }
      );
    }

    // Patricia Lima - Manicure
    if (professionalMap["patricia.lima@delbicos.com"]) {
      const profId = professionalMap["patricia.lima@delbicos.com"];
      const subcategoryId = subcategoryMap["Manicure"] || null;

      services.push(
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Manicure Completa",
          description:
            "Manicure completa com cutilagem, esmaltação e hidratação das mãos.",
          price: 45.0,
          duration: 115,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Pedicure Completa",
          description:
            "Pedicure completa com lixamento, cutilagem, esmaltação e hidratação dos pés.",
          price: 50.0,
          duration: 110,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Alongamento de Unhas em Gel",
          description:
            "Alongamento de unhas com gel de qualidade, design personalizado e acabamento impecável.",
          price: 120.0,
          duration: 125,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Unhas Decoradas",
          description:
            "Nail art com designs exclusivos, pedrarias e decorações personalizadas.",
          price: 80.0,
          duration: 125,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Spa para Mãos e Pés",
          description:
            "Tratamento completo com esfoliação, hidratação profunda e massagem relaxante.",
          price: 90.0,
          duration: 125,
          active: true,
          created_at: now,
          updated_at: now,
        }
      );
    }

    // Fernando Henrique - Jardineiro
    if (professionalMap["fernando.dias@delbicos.com"]) {
      const profId = professionalMap["fernando.dias@delbicos.com"];
      const subcategoryId = subcategoryMap["Jardineiro"] || null;

      services.push(
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Manutenção de Jardim",
          description:
            "Manutenção completa de jardins, incluindo poda, adubação e limpeza.",
          price: 120.0,
          duration: 315,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Paisagismo e Criação de Jardins",
          description:
            "Projeto e execução de jardins personalizados com plantas ornamentais e decorativas.",
          price: 350.0,
          duration: 185,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Poda de Árvores e Arbustos",
          description:
            "Poda técnica de árvores e arbustos, mantendo a saúde e estética das plantas.",
          price: 100.0,
          duration: 125,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Instalação de Sistema de Irrigação",
          description:
            "Instalação de sistema de irrigação automática para jardins e gramados.",
          price: 280.0,
          duration: 155,
          active: true,
          created_at: now,
          updated_at: now,
        }
      );
    }

    // Juliana Martins - Personal Organizer
    if (professionalMap["juliana.martins@delbicos.com"]) {
      const profId = professionalMap["juliana.martins@delbicos.com"];
      const subcategoryId = subcategoryMap["Personal Organizer"] || null;

      services.push(
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Organização de Armários",
          description:
            "Organização completa de armários e closets com técnicas profissionais de organização.",
          price: 150.0,
          duration: 135,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Organização de Cozinha e Despensa",
          description:
            "Organização funcional de cozinha e despensa, otimização de espaços e etiquetagem.",
          price: 180.0,
          duration: 145,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Consultoria de Organização Residencial",
          description:
            "Consultoria completa para organização de toda a residência com método personalizado.",
          price: 250.0,
          duration: 155,
          active: true,
          created_at: now,
          updated_at: now,
        },
        {
          professional_id: profId,
          subcategory_id: subcategoryId,
          title: "Organização de Documentos",
          description:
            "Organização e arquivamento de documentos pessoais e familiares com sistema eficiente.",
          price: 120.0,
          duration: 125,
          active: true,
          created_at: now,
          updated_at: now,
        }
      );
    }

    const servicesToInsert = services.map((s) => ({
      ...s,
      created_at: s.created_at || now,
      updated_at: s.updated_at || now,
    }));

    await queryInterface.bulkInsert("service", servicesToInsert);
  },

  async down(queryInterface, Sequelize) {
    const professionals = await queryInterface.sequelize.query(
      `SELECT p.id 
       FROM professional p 
       INNER JOIN users u ON p.user_id = u.id 
       WHERE u.email IN (
         'carlos.silva@delbicos.com',
         'maria.costa@delbicos.com',
         'joao.oliveira@delbicos.com',
         'ana.rodrigues@delbicos.com',
         'ricardo.souza@delbicos.com',
         'patricia.lima@delbicos.com',
         'fernando.dias@delbicos.com',
         'juliana.martins@delbicos.com'
       )`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const professionalIds = professionals.map((p) => p.id);

    await queryInterface.bulkDelete("service", {
      professional_id: {
        [Sequelize.Op.in]: professionalIds,
      },
    });
  },
};
