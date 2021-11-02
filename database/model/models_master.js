const { Sequelize, DataTypes } = require("sequelize");
const database = require("../instance/mini_MES_instance");

const tabel = database.define(
    "model_master",
    {
        // attributes
        model_number: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        model_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        drawing: {
            type: Sequelize.DataTypes.BLOB("long"),
            allowNull: true,
        },
        updater: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, 
    {
        //option
    }
);

(async () => {
    await tabel.sync({ force: false });
})();

module.exports = tabel;
