'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Edge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Event)
    }
  }
  Edge.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    source: DataTypes.STRING,
    target: DataTypes.STRING,
    animated: DataTypes.BOOLEAN,
    style: DataTypes.JSON,
    due: DataTypes.STRING,
    eventId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Edge',
  });
  return Edge;
};