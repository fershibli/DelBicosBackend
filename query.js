const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://delbicos:postgres123@localhost:5432/delbicos');
sequelize.query('SELECT * FROM "professional" WHERE id = 1')
  .then(res => { console.log(res[0]); process.exit(); })
  .catch(err => { console.error(err); process.exit(1); });
