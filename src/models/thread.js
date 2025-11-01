"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/config");

const Thread = sequelize.define(
  "Thread",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    overview: {
      type: DataTypes.STRING,
      allowNull: true
    },
    anonymous: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Thread"
  }
);

module.exports = Thread;