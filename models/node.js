'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Node extends Model {
    static associate(models) {
      this.belongsTo(models.Event)
    }
  }
  Node.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    position: DataTypes.JSON,
    data: DataTypes.JSON,
    type: DataTypes.STRING,
    eventId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Node',
  });
  return Node;
};