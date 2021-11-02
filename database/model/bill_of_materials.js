const { Sequelize, DataTypes } = require("sequelize");
const database = require("../instance/mini_MES_instance");

const tabel = database.define(
    "bill_of_material",
    {
        // attributes
        model_number: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        material_number: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        usage: {
            type: Sequelize.DOUBLE,
            allowNull: false,
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
