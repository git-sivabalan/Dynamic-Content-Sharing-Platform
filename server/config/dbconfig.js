
const { Sequelize } = require('sequelize');
// DATABASEUSERNAME=root
// PASSWORD=password
// DATABASE=gomobile_dev

const sequelize = new Sequelize( "test", "root", "password", {
  host:  process.env.HOST,
  dialect: 'mysql',
});
 sequelize.authenticate().then(()=>{
  console.log('Connection has been established successfully.');
}).catch((e)=>{
  console.error('Unable to connect to the database:', e);
});

module.exports = sequelize;
