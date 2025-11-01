"use strict";
const PromiseRouter = require("express-promise-router");
const { createComment } = require("./comment.service");
const { getThreadById } = require("../threads/thread.service");

const commentRouter = PromiseRouter();

commentRouter.post("/", async (req, res) => {
  await console.log(req.body.commentId + "**************");
  await createComment(
    req.body.content,
    req.body.threadId,
    req.body.commentId,
    req.body.reply,
    req.user,
  );
  const redirect = true;

  const thread = await getThreadById(req.body.threadId);
  const user = req.user;
  let comments = undefined;
  let commentCount = -1;
  try {
    comments = await thread.getComments();
    commentCount = comments.length;
  } catch (error) {
    console.error(error);
  }
  const users = [];
  for (let i = 0; i < comments.length; i++) {
    users[i] = await comments[i].getUser();
  }
  if (!user) {
    res.redirect("/user");
  } else {
    if (req.query["hashtag"] !== undefined) {
      const tag = req.query["hashtag"] + "";
      const re = new RegExp("#" + tag + "\\s");
      const re2 = new RegExp("#" + tag + "$");
      comments = comments.filter((comment) => {
        return comment.content.match(re) || comment.content.match(re2);
      });
    }
    let favorite;
    const fav = await thread.getUsers({ where: { id: user.id }});
    if(fav.length > 0){
      favorite = true;
    } else {
      favorite = false;
    }
    res.render("thread", { thread, comments, user, users, commentCount, redirect, favorite});
  }
  return;
});

module.exports = {
  commentRouter,
};
