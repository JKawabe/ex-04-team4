const path = require("path");
const PromiseRouter = require("express-promise-router");
const { threadRouter } = require("./threads/thread.controller.js");
const bodyParser = require("body-parser");
const express = require("express");
const sequelize = require("../config/config");
const { userRouter } = require("./user/user.controller.js");
const { commentRouter } = require("./comments/comment.controller.js");
const PORT = 3010;
require("./models/association.js");

const run = () => {
  const app = express();

  // テンプレートエンジンに EJS を使うようにする設定
  app.set("view engine", "ejs");
  app.set("views", path.resolve(__dirname, "views"));

  // 静的ファイルを提供する
  app.use(express.static(path.resolve(__dirname, "public")));

  sequelize.sync();

  require("./user/passport.js")(app);

  const router = PromiseRouter();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(router);
  app.use("/threads", threadRouter);
  app.use("/comments", commentRouter);
  app.use("/user", userRouter);

  router.get("/", (req, res) => {
    res.redirect("/user");
  });

  app.listen(PORT, () => {
    console.log(`Team4 app listening on port ${PORT}`);
  });
};

module.exports = {
  run,
};
