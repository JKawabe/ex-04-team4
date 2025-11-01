"use strict";

const Comment = require("../models/comment");

const getAllComments = async () => {
  const comments = await Comment.findAll();
  return comments;
};

const createComment = async (content, threadId, commentId, reply, user) => {
  await Comment.create({
    content,
    threadId,
    commentId: parseInt(commentId),
    userId: user.id,
    reply,
  });
};

const getCommentById = async (id) => {
  const comment = Comment.findOne({
    where: {
      id,
    },
  });
  return comment;
};

module.exports = {
  getAllComments,
  createComment,
  getCommentById,
};
