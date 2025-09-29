"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Buscar IDs dos clientes
    const clients = await queryInterface.sequelize.query(
      `SELECT c.id as client_id, c.user_id, c.main_address_id 
       FROM client c 
       JOIN users u ON c.user_id = u.id 
       WHERE u.name IN ('Fernando', 'Isabel', 'Douglas', 'Gustavo', 'Eduardo', 'Iago', 'Lucas')
       ORDER BY u.name`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (clients.length === 0) {
      throw new Error("Nenhum cliente encontrado");
    }

    // Buscar IDs dos profissionais
    const professionals = await queryInterface.sequelize.query(
      `SELECT p.id as professional_id, p.user_id 
       FROM professional p 
       JOIN users u ON p.user_id = u.id 
       WHERE u.name IN ('Fernando', 'Isabel', 'Douglas', 'Gustavo', 'Eduardo', 'Iago', 'Lucas')
       ORDER BY u.name`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (professionals.length === 0) {
      throw new Error("Nenhum profissional encontrado");
    }

    // Buscar IDs dos serviços
    const services = await queryInterface.sequelize.query(
      `SELECT s.id as service_id, s.professional_id, s.duration 
       FROM service s 
       JOIN professional p ON s.professional_id = p.id 
       ORDER BY s.professional_id`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (services.length === 0) {
      throw new Error("Nenhum serviço encontrado");
    }

    const appointments = [];
    const statuses = ["pending", "confirmed", "completed", "canceled"];

    // Data base para os agendamentos (próxima segunda-feira)
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + ((1 + 7 - baseDate.getDay()) % 7)); // Próxima segunda
    baseDate.setHours(9, 0, 0, 0); // 9:00 AM

    clients.forEach((client, clientIndex) => {
      // Encontrar o próximo profissional (evitar que preste serviço para si mesmo)
      const nextProfessionalIndex = (clientIndex + 1) % professionals.length;
      const professional = professionals[nextProfessionalIndex];

      // Encontrar o serviço do profissional
      const service = services.find(
        (s) => s.professional_id === professional.professional_id
      );

      if (!service) {
        console.warn(
          `Nenhum serviço encontrado para o profissional ${professional.professional_id}`
        );
        return;
      }

      // Criar 4 agendamentos (um para cada status) para este cliente
      statuses.forEach((status, statusIndex) => {
        const appointmentDate = new Date(baseDate);
        // Espaçar os agendamentos: cada cliente em um dia diferente, cada status em horários diferentes
        appointmentDate.setDate(appointmentDate.getDate() + clientIndex);
        appointmentDate.setHours(9 + statusIndex * 2, 0, 0, 0); // 9h, 11h, 13h, 15h

        const startTime = new Date(appointmentDate);
        const endTime = new Date(appointmentDate);
        endTime.setMinutes(endTime.getMinutes() + service.duration);

        appointments.push({
          professional_id: professional.professional_id,
          client_id: client.client_id,
          service_id: service.service_id,
          address_id: client.main_address_id,
          start_time: startTime,
          end_time: endTime,
          status: status,
        });
      });
    });

    await queryInterface.bulkInsert("appointment", appointments);
  },

  async down(queryInterface, Sequelize) {
    // Buscar IDs dos clientes para reverter
    const clients = await queryInterface.sequelize.query(
      `SELECT c.id FROM client c 
       JOIN users u ON c.user_id = u.id 
       WHERE u.name IN ('Fernando', 'Isabel', 'Douglas', 'Gustavo', 'Eduardo', 'Iago', 'Lucas')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (clients.length > 0) {
      const clientIds = clients.map((client) => client.id);
      await queryInterface.bulkDelete(
        "appointment",
        {
          client_id: clientIds,
        },
        {}
      );
    }
  },
};
