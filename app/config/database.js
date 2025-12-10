const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mindcare_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Test connection
sequelize.authenticate()
  .then(() => console.log('MySQL connected via phpMyAdmin'))
  .catch(err => console.error('MySQL connection error:', err));

module.exports = sequelize;