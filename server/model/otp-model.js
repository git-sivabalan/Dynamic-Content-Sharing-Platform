const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

const Otp = sequelize.define('Otp', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Otp;
