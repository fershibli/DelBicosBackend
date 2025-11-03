"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const salt = await bcrypt.genSalt(10);
    const newUsers = [
      {
        name: "Carlos Silva Santos",
        email: "carlos.silva@delbicos.com",
        phone: "11987654321",
        password: await bcrypt.hash("senha123", salt),
        active: true,
        avatar_uri: "https://i.pravatar.cc/150?img=12",
        banner_uri: "https://picsum.photos/seed/carlos/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Maria Fernanda Costa",
        email: "maria.costa@delbicos.com",
        phone: "11976543210",
        password: await bcrypt.hash("senha123", salt),
        active: true,
        avatar_uri: "https://i.pravatar.cc/150?img=47",
        banner_uri: "https://picsum.photos/seed/maria/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "João Pedro Oliveira",
        email: "joao.oliveira@delbicos.com",
        phone: "11965432109",
        password: await bcrypt.hash("senha123", 10),
        active: true,
        avatar_uri: "https://i.pravatar.cc/150?img=33",
        banner_uri: "https://picsum.photos/seed/joao/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Ana Paula Rodrigues",
        email: "ana.rodrigues@delbicos.com",
        phone: "11954321098",
        password: await bcrypt.hash("senha123", 10),
        active: true,
        avatar_uri: "https://i.pravatar.cc/150?img=48",
        banner_uri: "https://picsum.photos/seed/ana/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Ricardo Almeida Souza",
        email: "ricardo.souza@delbicos.com",
        phone: "11943210987",
        password: await bcrypt.hash("senha123", 10),
        active: true,
        avatar_uri: "https://i.pravatar.cc/150?img=14",
        banner_uri: "https://picsum.photos/seed/ricardo/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Patricia Lima Santos",
        email: "patricia.lima@delbicos.com",
        phone: "11932109876",
        password: await bcrypt.hash("senha123", 10),
        active: true,
        avatar_uri: "https://i.pravatar.cc/150?img=49",
        banner_uri: "https://picsum.photos/seed/patricia/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Fernando Henrique Dias",
        email: "fernando.dias@delbicos.com",
        phone: "11921098765",
        password: await bcrypt.hash("senha123", 10),
        active: true,
        avatar_uri: "https://i.pravatar.cc/150?img=15",
        banner_uri: "https://picsum.photos/seed/fernando/800/200",
        created_at: now,
        updated_at: now,
      },
      {
        name: "Juliana Martins Pereira",
        email: "juliana.martins@delbicos.com",
        phone: "11910987654",
        password: await bcrypt.hash("senha123", 10),
        active: true,
        avatar_uri: "https://i.pravatar.cc/150?img=44",
        banner_uri: "https://picsum.photos/seed/juliana/800/200",
        created_at: now,
        updated_at: now,
      },
    ];

    const usersToInsert = newUsers.map((user) => ({
      ...user,
      password: user.password,
      created_at: user.created_at || now,
      updated_at: user.updated_at || now,
    }));
    await queryInterface.bulkInsert("users", usersToInsert);

    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM users WHERE email IN (${newUsers
        .map((u) => `'${u.email}'`)
        .join(",")})`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userMap = users.reduce((acc, user) => {
      acc[user.email] = user.id;
      return acc;
    }, {});

    const professionals = [
      {
        user_id: userMap["carlos.silva@delbicos.com"],
        cpf: "11122233344",
        cnpj: "12345678000190",
        description: "Eletricista profissional com 15 anos de experiência...",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap["maria.costa@delbicos.com"],
        cpf: "22233344455",
        description: "Diarista experiente e cuidadosa...",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap["joao.oliveira@delbicos.com"],
        cpf: "33344455566",
        cnpj: "23456789000101",
        description:
          "Encanador profissional certificado. Especialista em desentupimentos, instalação de tubulações, conserto de vazamentos e manutenção de sistemas hidráulicos. Trabalho com garantia e atendimento 24h para emergências.",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap["ana.rodrigues@delbicos.com"],
        cpf: "44455566677",
        description:
          "Designer de interiores e decoradora. Transformo ambientes com bom gosto e criatividade, respeitando o orçamento do cliente. Consultoria personalizada, escolha de móveis, cores e acessórios. Projetos 3D disponíveis.",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap["ricardo.souza@delbicos.com"],
        cpf: "55566677788",
        cnpj: "34567890000112",
        description:
          "Pedreiro e mestre de obras com 20 anos de experiência. Realizo reformas completas, construções, acabamentos e alvenaria. Equipe qualificada, trabalho com materiais de primeira linha e cumpro prazos.",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap["patricia.lima@delbicos.com"],
        cpf: "66677788899",
        description:
          "Manicure e pedicure profissional. Atendimento domiciliar com kit esterilizado e produtos de alta qualidade. Faço unhas decoradas, alongamento, hidratação e tratamentos. Horários flexíveis, inclusive finais de semana.",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap["fernando.dias@delbicos.com"],
        cpf: "77788899900",
        cnpj: "45678901000123",
        description:
          "Jardineiro e paisagista especializado. Cuido de jardins, podas, adubação, plantio e design de áreas verdes. Trabalho com plantas ornamentais, hortas e sistemas de irrigação. Manutenção periódica disponível.",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userMap["juliana.martins@delbicos.com"],
        cpf: "88899900011",
        description:
          "Personal organizer e consultora de organização. Ajudo a organizar armários, closets, despensas e qualquer ambiente da casa. Método eficiente e duradouro. Sessões de organização com dicas personalizadas.",
        created_at: now,
        updated_at: now,
      },
    ];
    const professionalsToInsert = professionals.map((p) => ({
      ...p,
      created_at: p.created_at || now,
      updated_at: p.updated_at || now,
    }));
    await queryInterface.bulkInsert("professional", professionalsToInsert);

    const professionalsData = await queryInterface.sequelize.query(
      `SELECT id, user_id FROM professional WHERE user_id IN (${Object.values(
        userMap
      ).join(",")})`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const clients = await queryInterface.sequelize.query(
      "SELECT id FROM client LIMIT 5",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const services = await queryInterface.sequelize.query(
      "SELECT id FROM service LIMIT 10",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const addresses = await queryInterface.sequelize.query(
      "SELECT id FROM address LIMIT 8",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const appointments = [];
    const reviews = [
      {
        rating: 5,
        text: "Excelente profissional! Muito atencioso e caprichoso...",
      },
      {
        rating: 5,
        text: "Serviço impecável, pontualidade exemplar. Com certeza contratarei novamente.",
      },
      {
        rating: 4,
        text: "Muito bom! Trabalho bem feito e preço justo. Apenas o horário atrasou um pouco.",
      },
      {
        rating: 5,
        text: "Perfeito! Superou minhas expectativas. Profissional competente e educado.",
      },
      {
        rating: 4,
        text: "Ótimo atendimento e qualidade no serviço. Voltarei a contratar com certeza.",
      },
      {
        rating: 5,
        text: "Simplesmente maravilhoso! Muito cuidadoso e detalhista. Amei o resultado!",
      },
      {
        rating: 5,
        text: "Profissional de confiança, trabalho de excelente qualidade. Nota 10!",
      },
      {
        rating: 4,
        text: "Muito satisfeito com o serviço prestado. Apenas achei um pouco caro.",
      },
      {
        rating: 5,
        text: "Melhor profissional que já contratei! Educado, pontual e muito caprichoso.",
      },
      {
        rating: 5,
        text: "Trabalho excepcional! Resolveu meu problema rapidamente. Super indico!",
      },
      {
        rating: 4,
        text: "Bom trabalho, ficou muito bom. Só demorou um pouco mais que o esperado.",
      },
      {
        rating: 5,
        text: "Fantástico! Muito profissional e atencioso. O resultado ficou perfeito!",
      },
    ];

    professionalsData.forEach((prof, profIndex) => {
      const numAppointments = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numAppointments; i++) {
        const startDate = new Date();
        startDate.setDate(
          startDate.getDate() - (30 + Math.floor(Math.random() * 60))
        );
        startDate.setHours(8 + Math.floor(Math.random() * 8), 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);

        const review = reviews[Math.floor(Math.random() * reviews.length)];
        appointments.push({
          professional_id: prof.id,
          client_id: clients[i % clients.length].id,
          service_id: services[(profIndex + i) % services.length].id,
          address_id: addresses[(profIndex + i) % addresses.length].id,
          start_time: startDate,
          end_time: endDate,
          status: "completed",
          rating: review.rating,
          review: review.text,
          payment_intent_id: `pi_test_${prof.id}_${i}_${startDate.getTime()}`,
          created_at: now,
          updated_at: now,
        });
      }
    });
    await queryInterface.bulkInsert("appointment", appointments);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("appointment", {
      status: "completed",
      review: {
        [Sequelize.Op.in]: [
          "Excelente profissional! Muito atencioso e caprichoso. Super recomendo!",
          "Serviço impecável, pontualidade exemplar. Com certeza contratarei novamente.",
          "Muito bom! Trabalho bem feito e preço justo. Apenas o horário atrasou um pouco.",
          "Perfeito! Superou minhas expectativas. Profissional competente e educado.",
          "Ótimo atendimento e qualidade no serviço. Voltarei a contratar com certeza.",
          "Simplesmente maravilhoso! Muito cuidadoso e detalhista. Amei o resultado!",
          "Profissional de confiança, trabalho de excelente qualidade. Nota 10!",
          "Muito satisfeito com o serviço prestado. Apenas achei um pouco caro.",
          "Melhor profissional que já contratei! Educado, pontual e muito caprichoso.",
          "Trabalho excepcional! Resolveu meu problema rapidamente. Super indico!",
          "Bom trabalho, ficou muito bom. Só demorou um pouco mais que o esperado.",
          "Fantástico! Muito profissional e atencioso. O resultado ficou perfeito!",
        ],
      },
    });

    // Deletar profissionais criados
    await queryInterface.bulkDelete("professional", {
      cpf: {
        [Sequelize.Op.in]: [
          "123.456.789-01",
          "234.567.890-12",
          "345.678.901-23",
          "456.789.012-34",
          "567.890.123-45",
          "678.901.234-56",
          "789.012.345-67",
          "890.123.456-78",
        ],
      },
    });

    // Deletar usuários criados
    await queryInterface.bulkDelete("users", {
      email: {
        [Sequelize.Op.in]: [
          "carlos.silva@delbicos.com",
          "maria.costa@delbicos.com",
          "joao.oliveira@delbicos.com",
          "ana.rodrigues@delbicos.com",
          "ricardo.souza@delbicos.com",
          "patricia.lima@delbicos.com",
          "fernando.dias@delbicos.com",
          "juliana.martins@delbicos.com",
        ],
      },
    });
  },
};
