const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://delbicos:postgres123@localhost:5432/delbicos');

async function main() {
  try {
    const users = await sequelize.query("SELECT id, name, email FROM \"users\" WHERE name LIKE '%Iago%' OR name LIKE '%Fernando%'");
    console.log('=== USERS ===');
    console.log(users[0]);

    const clients = await sequelize.query(`
      SELECT c.id, c.user_id, u.name 
      FROM "client" c 
      JOIN "users" u ON c.user_id = u.id 
      WHERE u.name LIKE '%Iago%' OR u.name LIKE '%Fernando%'
    `);
    console.log('\n=== CLIENTS ===');
    console.log(clients[0]);

    const professionals = await sequelize.query(`
      SELECT p.id, p.user_id, u.name 
      FROM "professional" p 
      JOIN "users" u ON p.user_id = u.id 
      WHERE u.name LIKE '%Iago%' OR u.name LIKE '%Fernando%'
    `);
    console.log('\n=== PROFESSIONALS ===');
    console.log(professionals[0]);

    const appointments = await sequelize.query(`
      SELECT 
        a.id, 
        a.client_id, 
        uc.name AS client_name, 
        a.professional_id, 
        up.name AS professional_name, 
        a.status, 
        a.start_time, 
        s.title AS service_title
      FROM "appointment" a
      JOIN "client" c ON a.client_id = c.id
      JOIN "users" uc ON c.user_id = uc.id
      JOIN "professional" p ON a.professional_id = p.id
      JOIN "users" up ON p.user_id = up.id
      JOIN "service" s ON a.service_id = s.id
      WHERE uc.name LIKE '%Iago%' OR up.name LIKE '%Iago%' OR uc.name LIKE '%Fernando%' OR up.name LIKE '%Fernando%'
      ORDER BY a.start_time DESC
    `);
    console.log('\n=== APPOINTMENTS INV. IAGO OR FERNANDO ===');
    console.log(appointments[0]);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
