const { Sequelize, DataTypes } = require("sequelize");
const database = require("../instance/mini_MES_instance");

const tabel = database.define(
    "material_master",
    {
        // attributes
        material_number: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        material_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        unit_of_measure: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        drawing : {
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
