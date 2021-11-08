const { Sequelize, DataTypes } = require("sequelize");
const database = require("../instance/mini_MES_instance");

const tabel = database.define(
    "work_order_sheet",
    {
        // attributes
        WOS_number: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        MO_number: {
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
        production_line: {
            type: Sequelize.STRING,
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
