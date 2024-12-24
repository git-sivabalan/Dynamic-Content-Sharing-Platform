const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");

const InterestCategory = sequelize.define("InterestCategory", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});


module.exports = InterestCategory;
