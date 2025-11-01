"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/config");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reply: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Comment",
  },
);
module.exports = Comment;
