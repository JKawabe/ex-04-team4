"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/config");

const User = sequelize.define(
  "User",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    administrator: {
      type: DataTypes.STRING,
      allowNull: false
    },
    theme_color: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Thread"
  }
);

module.exports = User;