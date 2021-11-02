const Sequelize = require("sequelize");
const sequelize = new Sequelize("mini_MES", "postgres", "mic@admin", {
  host: "192.168.100.40",
  dialect: "postgres",
  // dialectOptions: {
  //   options: {
  //     instanceName: "FDBFAN",
  //   },
  // }, 
});  
  
(async () => {
  await sequelize.authenticate();
})(); 

module.exports = sequelize;
