const { Sequelize, DataTypes } = require("sequelize");
const database = require("../instance/mini_MES_instance");

const tabel = database.define(
    "manufacturing_order",
    {
        // attributes
        manufacturing_order_number: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        model_number: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        quantity: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        production_date: {
            type: Sequelize.DATE,
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
