const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');
const User = require('./user-model');
const InterestCategory = require('./interest-category-model');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',  
    },
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: InterestCategory,
      key: 'id',  
    },
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user', 
});
Post.belongsTo(InterestCategory, {
  foreignKey: 'categoryId',
  as: 'category', 
});

module.exports = Post;
