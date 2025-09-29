"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE name IN ('Fernando', 'Isabel', 'Douglas', 'Gustavo', 'Eduardo', 'Iago', 'Lucas')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map((user) => user.id);

    const addresses = await queryInterface.sequelize.query(
      `SELECT id FROM address WHERE user_id IN (${userIds.join(
        ","
      )}) ORDER BY user_id`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const addressIds = addresses.map((address) => address.id);

    const professionalCpfs = [
      "12345678901",
      "23456789012",
      "34567890123",
      "45678901234",
      "56789012345",
      "67890123456",
      "78901234567",
    ];

    const cnpjs = [
      "12653956000171",
      "73567077000111",
      "85594645000152",
      "56981204000105",
      "38995869000196",
      "98956510000131",
      "26009244000129",
    ];

    // Descrições dos profissionais
    const descriptions = [
      "Desenvolvedor full-stack especializado em React e Node.js",
      "Designer UI/UX com foco em experiência do usuário",
      "Especialista em DevOps e infraestrutura cloud",
      "Analista de sistemas com experiência em arquitetura de software",
      "Especialista em mobile development com React Native",
      "Expert em testes automatizados e qualidade de software",
      "Consultor em transformação digital e agilidade",
    ];

    const professionals = userIds.map((userId, index) => ({
      user_id: userId,
      main_address_id: addressIds[index],
      cpf: professionalCpfs[index],
      cnpj: cnpjs[index],
      description: descriptions[index],
    }));

    await queryInterface.bulkInsert("professional", professionals);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("professional", null, {});
  },
};
