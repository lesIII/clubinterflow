'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      this.hasMany(models.Node);
      this.hasMany(models.Edge);
    }
  }
  Event.init({
    name: DataTypes.STRING,
    date: DataTypes.STRING,
    editor_roles: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
