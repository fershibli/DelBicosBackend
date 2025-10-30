'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar novos usuários para profissionais
    const newUsers = [
      {
        name: 'Carlos Silva Santos',
        email: 'carlos.silva@delbicos.com',
        phone: '11987654321',
        password: await bcrypt.hash('senha123', 10),
        active: true,
        avatar_uri: 'https://i.pravatar.cc/150?img=12',
        banner_uri: 'https://picsum.photos/seed/carlos/800/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Maria Fernanda Costa',
        email: 'maria.costa@delbicos.com',
        phone: '11976543210',
        password: await bcrypt.hash('senha123', 10),
        active: true,
        avatar_uri: 'https://i.pravatar.cc/150?img=47',
        banner_uri: 'https://picsum.photos/seed/maria/800/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'João Pedro Oliveira',
        email: 'joao.oliveira@delbicos.com',
        phone: '11965432109',
        password: await bcrypt.hash('senha123', 10),
        active: true,
        avatar_uri: 'https://i.pravatar.cc/150?img=33',
        banner_uri: 'https://picsum.photos/seed/joao/800/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ana Paula Rodrigues',
        email: 'ana.rodrigues@delbicos.com',
        phone: '11954321098',
        password: await bcrypt.hash('senha123', 10),
        active: true,
        avatar_uri: 'https://i.pravatar.cc/150?img=48',
        banner_uri: 'https://picsum.photos/seed/ana/800/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ricardo Almeida Souza',
        email: 'ricardo.souza@delbicos.com',
        phone: '11943210987',
        password: await bcrypt.hash('senha123', 10),
        active: true,
        avatar_uri: 'https://i.pravatar.cc/150?img=14',
        banner_uri: 'https://picsum.photos/seed/ricardo/800/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Patricia Lima Santos',
        email: 'patricia.lima@delbicos.com',
        phone: '11932109876',
        password: await bcrypt.hash('senha123', 10),
        active: true,
        avatar_uri: 'https://i.pravatar.cc/150?img=49',
        banner_uri: 'https://picsum.photos/seed/patricia/800/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fernando Henrique Dias',
        email: 'fernando.dias@delbicos.com',
        phone: '11921098765',
        password: await bcrypt.hash('senha123', 10),
        active: true,
        avatar_uri: 'https://i.pravatar.cc/150?img=15',
        banner_uri: 'https://picsum.photos/seed/fernando/800/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Juliana Martins Pereira',
        email: 'juliana.martins@delbicos.com',
        phone: '11910987654',
        password: await bcrypt.hash('senha123', 10),
        active: true,
        avatar_uri: 'https://i.pravatar.cc/150?img=44',
        banner_uri: 'https://picsum.photos/seed/juliana/800/200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('users', newUsers);

    // Buscar IDs dos usuários criados
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM users WHERE email IN (${newUsers.map(u => `'${u.email}'`).join(',')})`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user.id;
    });

    // Criar profissionais
    const professionals = [
      {
        user_id: userMap['carlos.silva@delbicos.com'],
        cpf: '123.456.789-01',
        cnpj: '12.345.678/0001-90',
        description: 'Eletricista profissional com 15 anos de experiência. Especializado em instalações residenciais e comerciais, manutenção preventiva e corretiva. Atendo com rapidez e qualidade, garantindo a segurança de todas as instalações.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userMap['maria.costa@delbicos.com'],
        cpf: '234.567.890-12',
        description: 'Diarista experiente e cuidadosa. Trabalho com limpeza residencial há 8 anos, sempre com atenção aos detalhes. Uso produtos de qualidade e tenho flexibilidade de horários. Referências disponíveis.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userMap['joao.oliveira@delbicos.com'],
        cpf: '345.678.901-23',
        cnpj: '23.456.789/0001-01',
        description: 'Encanador profissional certificado. Especialista em desentupimentos, instalação de tubulações, conserto de vazamentos e manutenção de sistemas hidráulicos. Trabalho com garantia e atendimento 24h para emergências.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userMap['ana.rodrigues@delbicos.com'],
        cpf: '456.789.012-34',
        description: 'Designer de interiores e decoradora. Transformo ambientes com bom gosto e criatividade, respeitando o orçamento do cliente. Consultoria personalizada, escolha de móveis, cores e acessórios. Projetos 3D disponíveis.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userMap['ricardo.souza@delbicos.com'],
        cpf: '567.890.123-45',
        cnpj: '34.567.890/0001-12',
        description: 'Pedreiro e mestre de obras com 20 anos de experiência. Realizo reformas completas, construções, acabamentos e alvenaria. Equipe qualificada, trabalho com materiais de primeira linha e cumpro prazos.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userMap['patricia.lima@delbicos.com'],
        cpf: '678.901.234-56',
        description: 'Manicure e pedicure profissional. Atendimento domiciliar com kit esterilizado e produtos de alta qualidade. Faço unhas decoradas, alongamento, hidratação e tratamentos. Horários flexíveis, inclusive finais de semana.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userMap['fernando.dias@delbicos.com'],
        cpf: '789.012.345-67',
        cnpj: '45.678.901/0001-23',
        description: 'Jardineiro e paisagista especializado. Cuido de jardins, podas, adubação, plantio e design de áreas verdes. Trabalho com plantas ornamentais, hortas e sistemas de irrigação. Manutenção periódica disponível.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: userMap['juliana.martins@delbicos.com'],
        cpf: '890.123.456-78',
        description: 'Personal organizer e consultora de organização. Ajudo a organizar armários, closets, despensas e qualquer ambiente da casa. Método eficiente e duradouro. Sessões de organização com dicas personalizadas.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('professional', professionals);

    // Buscar IDs dos profissionais criados
    const professionalsData = await queryInterface.sequelize.query(
      `SELECT id, user_id FROM professional WHERE user_id IN (${Object.values(userMap).join(',')})`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Buscar alguns clientes e serviços existentes para criar appointments
    const clients = await queryInterface.sequelize.query(
      'SELECT id FROM client LIMIT 5',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const services = await queryInterface.sequelize.query(
      'SELECT id FROM service LIMIT 10',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const addresses = await queryInterface.sequelize.query(
      'SELECT id FROM address LIMIT 8',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Criar appointments concluídos com avaliações
    const appointments = [];
    const reviews = [
      { rating: 5, text: 'Excelente profissional! Muito atencioso e caprichoso. Super recomendo!' },
      { rating: 5, text: 'Serviço impecável, pontualidade exemplar. Com certeza contratarei novamente.' },
      { rating: 4, text: 'Muito bom! Trabalho bem feito e preço justo. Apenas o horário atrasou um pouco.' },
      { rating: 5, text: 'Perfeito! Superou minhas expectativas. Profissional competente e educado.' },
      { rating: 4, text: 'Ótimo atendimento e qualidade no serviço. Voltarei a contratar com certeza.' },
      { rating: 5, text: 'Simplesmente maravilhoso! Muito cuidadoso e detalhista. Amei o resultado!' },
      { rating: 5, text: 'Profissional de confiança, trabalho de excelente qualidade. Nota 10!' },
      { rating: 4, text: 'Muito satisfeito com o serviço prestado. Apenas achei um pouco caro.' },
      { rating: 5, text: 'Melhor profissional que já contratei! Educado, pontual e muito caprichoso.' },
      { rating: 5, text: 'Trabalho excepcional! Resolveu meu problema rapidamente. Super indico!' },
      { rating: 4, text: 'Bom trabalho, ficou muito bom. Só demorou um pouco mais que o esperado.' },
      { rating: 5, text: 'Fantástico! Muito profissional e atencioso. O resultado ficou perfeito!' },
    ];

    professionalsData.forEach((prof, profIndex) => {
      // Criar entre 3 a 5 appointments para cada profissional
      const numAppointments = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numAppointments; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (30 + Math.floor(Math.random() * 60))); // 30 a 90 dias atrás
        startDate.setHours(8 + Math.floor(Math.random() * 8), 0, 0, 0); // Entre 8h e 16h
        
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2); // 2 horas de duração
        
        const review = reviews[Math.floor(Math.random() * reviews.length)];
        
        appointments.push({
          professional_id: prof.id,
          client_id: clients[i % clients.length].id,
          service_id: services[(profIndex + i) % services.length].id,
          address_id: addresses[(profIndex + i) % addresses.length].id,
          start_time: startDate,
          end_time: endDate,
          status: 'completed',
          rating: review.rating,
          review: review.text,
          payment_intent_id: `pi_test_${Date.now()}_${prof.id}_${i}`,
          createdAt: startDate,
          updatedAt: endDate,
        });
      }
    });

    await queryInterface.bulkInsert('appointment', appointments);
  },

  async down(queryInterface, Sequelize) {
    // Deletar appointments criados
    await queryInterface.bulkDelete('appointment', {
      status: 'completed',
      review: {
        [Sequelize.Op.in]: [
          'Excelente profissional! Muito atencioso e caprichoso. Super recomendo!',
          'Serviço impecável, pontualidade exemplar. Com certeza contratarei novamente.',
          'Muito bom! Trabalho bem feito e preço justo. Apenas o horário atrasou um pouco.',
          'Perfeito! Superou minhas expectativas. Profissional competente e educado.',
          'Ótimo atendimento e qualidade no serviço. Voltarei a contratar com certeza.',
          'Simplesmente maravilhoso! Muito cuidadoso e detalhista. Amei o resultado!',
          'Profissional de confiança, trabalho de excelente qualidade. Nota 10!',
          'Muito satisfeito com o serviço prestado. Apenas achei um pouco caro.',
          'Melhor profissional que já contratei! Educado, pontual e muito caprichoso.',
          'Trabalho excepcional! Resolveu meu problema rapidamente. Super indico!',
          'Bom trabalho, ficou muito bom. Só demorou um pouco mais que o esperado.',
          'Fantástico! Muito profissional e atencioso. O resultado ficou perfeito!',
        ]
      }
    });

    // Deletar profissionais criados
    await queryInterface.bulkDelete('professional', {
      cpf: {
        [Sequelize.Op.in]: [
          '123.456.789-01',
          '234.567.890-12',
          '345.678.901-23',
          '456.789.012-34',
          '567.890.123-45',
          '678.901.234-56',
          '789.012.345-67',
          '890.123.456-78',
        ]
      }
    });

    // Deletar usuários criados
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'carlos.silva@delbicos.com',
          'maria.costa@delbicos.com',
          'joao.oliveira@delbicos.com',
          'ana.rodrigues@delbicos.com',
          'ricardo.souza@delbicos.com',
          'patricia.lima@delbicos.com',
          'fernando.dias@delbicos.com',
          'juliana.martins@delbicos.com',
        ]
      }
    });
  }
};
