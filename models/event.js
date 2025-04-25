'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // define association here if needed later
    }
  }

  Event.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    timestamp: DataTypes.DATE,
    source: DataTypes.STRING,
    eventType: DataTypes.STRING,
    ip: DataTypes.STRING,
    headers: DataTypes.JSON,
    payload: DataTypes.JSON,
    token: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events',         // ✅ make sure this matches the DB table name
    freezeTableName: true,       // ✅ prevent pluralization if needed
    timestamps: true             // ✅ enables createdAt and updatedAt
  });

  return Event;
};
