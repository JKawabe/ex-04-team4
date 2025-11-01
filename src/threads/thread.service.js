"use strict";

const Thread = require("../models/thread");

const getAllThreads = async () => {
  const threads = await Thread.findAll();
  return threads;
};

const createThread = async (title, overview, anonymous) => {
  Thread.create({
    title,
    overview,
    anonymous
  });
};

const getThreadById = async (id) => {
  const thread = Thread.findOne({
    where: {
      id
    }
  });
  return thread;
};

const deleteThreadById = async (id) => {
  Thread.destroy({
    where: {
      id
    }
  });
};

const editThread = async (id, overview) => {
  Thread.update(
    { overview },
    { where: { id } }
  );
}

module.exports = {
  getAllThreads,
  createThread,
  getThreadById,
  deleteThreadById,
  editThread,
};
