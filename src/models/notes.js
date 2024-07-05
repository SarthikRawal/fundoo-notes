'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notes.init(
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      isArchive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isTrash: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      color: DataTypes.STRING,
      collabEmail: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      }
    },
    {
      sequelize,
      modelName: 'notes'
    }
  );
  return notes;
};
