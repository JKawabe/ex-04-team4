"use strict";
const PromiseRouter = require("express-promise-router");
const {
  getAllThreads,
  createThread,
  getThreadById,
  deleteThreadById,
  editThread,
} = require("./thread.service");

const threadRouter = PromiseRouter();

threadRouter.get("/", async (req, res) => {
  const threads = await getAllThreads();
  const user = req.user;
  const favorites = [];
  if (!user) {
    res.redirect("/user");
  } else {
    for(let i = 0; i < threads.length; i++) {
      const favuser = await threads[i].getUsers({ where: { id: user.id }});
      if(favuser.length > 0) {
        favorites[i] = true;
      } else {
        favorites[i] = false;
      }
    }
    res.render("index", { threads, user ,favorites });
  }
});

threadRouter.get("/favorite", async (req, res) => {
  const user = req.user;
  if (!user) {
    res.redirect("/user");
  } else {
    const threads = await user.getThreads();
    res.render("favorite", { threads, user });
  }
});

threadRouter.post("/", async (req, res) => {
  await createThread(req.body.title, req.body.overview, req.body.anonymous);
  res.redirect("/threads");
});

threadRouter.get("/addThread", async (req, res) => {
  const user = req.user;
  if (!user) {
    res.redirect("/user");
  } else {
    res.render("addThread", { user });
  }
});

threadRouter.get("/:id(\\d+)", async (req, res) => {
  const thread = await getThreadById(req.params.id);
  const user = req.user;
  let comments = undefined;
  let commentCount = -1;
  const redirect = false;
  try {
    comments = await thread.getComments();
    commentCount = comments.length;
  } catch (error) {
    console.error(error);
  }
  const users = [];
  for (let i = 0; i < comments.length; i++) {
    if(comments[i].getUser) {
      users[i] = await comments[i].getUser();
    } else {
      users[i] = undefined;
    }
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

threadRouter.get("/:id/delete", async (req, res) => {
  const thread = await getThreadById(req.params.id);
  const user = req.user;
  if (!user) {
    res.redirect("/user");
  } else {
    res.render("delete", { thread, user });
  }
});

threadRouter.post("/:id", async (req, res) => {
  await deleteThreadById(req.params.id);
  res.redirect("/threads");
});

threadRouter.post("/:id/edit", async (req, res) => {
  await editThread(req.params.id, req.body.overview);
  res.redirect(`/threads/${req.params.id}`);
});

module.exports = {
  threadRouter,
};
