"use strict";
const PromiseRouter = require("express-promise-router");
const userRouter = PromiseRouter();
const passport = require("passport");
const { createUser, getAllUsers, createFirstAdminUser, deleteUserById, changeAdminById, changeThemeColorById, chacgeUsernameById, findUserById, addFavorite } = require("./user.service");

userRouter.get("/", async (req, res) => {
  const user = req.user;
  createFirstAdminUser();
  if(!user) {
    res.render("login", { user });
  } else {
    res.redirect("/threads");
  }
});

userRouter.post("/", passport.authenticate('local', {
  successRedirect: '/threads',
  failureRedirect: '/user',
  failureFlash: false,
}));

userRouter.get("/register", async (req, res) => {
  const user = req.user;
  const error = undefined;
  res.render("register", { user, error });
});

userRouter.post("/register", async (req, res) => {
  const error = await createUser(req.body.username, req.body.employee_id, req.body.password, req.body.repassword);
  const user = req.user;
  if (error) {
    res.render("register", { user, error });
  } else {
    res.redirect("/user");
  }
});

userRouter.get("/logout", async (req, res) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
  });
  res.redirect("/user");
})

userRouter.get("/profile", async (req, res) => {
  const user = req.user;
  const error = undefined;
  const users = await getAllUsers();
  if(!user) {
    res.redirect("/user");
  } else {
    res.render("profile", { user, users, error });
  }
});

userRouter.post("/delete", async (req, res) => {
  deleteUserById(req.body.userid);
  res.redirect("/user/profile");
});

userRouter.post("/admin", async (req, res) => {
  changeAdminById(req.body.userid);
  res.redirect("/user/profile");
})

userRouter.post("/update", async (req, res) => {
  await changeThemeColorById(req.user.id, req.body.color);
  const error = await chacgeUsernameById(req.user.id, req.body.username);
  const user = await findUserById(req.user.id);
  const users = await getAllUsers();
  res.render("profile", { user, users, error })
})

userRouter.post("/favorite", async (req, res) => {
  await addFavorite(req.user.id, req.body.threadid);
  res.redirect(`/threads/${req.body.threadid}`)
})

userRouter.get("/:id(\\d+)", async (req, res) => {
  const user = req.user;
  if(!user) {
    res.redirect("/user");
  } else {
    const deleteUser = await findUserById(req.params.id);
    res.render("deleteUser", { user, deleteUser })
  }
})

module.exports = {
  userRouter,
};
