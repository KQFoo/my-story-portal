require('dotenv').config();
const { Sequelize } = require('sequelize');
const initModels = require('../models/init-models');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
);

const models = initModels(sequelize);

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

const syncDatabase = async () => {
    try {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await sequelize.sync({ alter: true });
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('Database synced...');
    } catch (err) {
        console.error('Unable to sync the database:', err);
    }
};

syncDatabase();

module.exports = {
    sequelize,
    models
};


