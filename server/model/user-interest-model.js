const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const User = require('./user-model');
const InterestCategory = require('./interest-category-model');

const UserInterest = sequelize.define('UserInterest', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

// Define associations with explicit foreign key naming to avoid duplication
User.belongsToMany(InterestCategory, {
  through: UserInterest,
  foreignKey: 'userId',
});
InterestCategory.belongsToMany(User, {
  through: UserInterest,
  foreignKey: 'categoryId',
});

// Ensure the association table's foreign keys match the column names in the `UserInterest` table
UserInterest.belongsTo(User, { foreignKey: 'userId' });
UserInterest.belongsTo(InterestCategory, { foreignKey: 'categoryId' });

module.exports = UserInterest;
