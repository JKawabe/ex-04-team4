const Thread = require("./thread");
const Comment = require("./comment");
const User = require("./user");

Thread.hasMany(Comment, { as: "comments", foreignKey: "threadId" });
Comment.belongsTo(Thread, {as: "thread", foreignKey: "threadId"});

User.hasMany(Comment, { as: "userComments", foreignKey: "userId" });
Comment.belongsTo(User, {as: "user", foreignKey: "userId"});

User.belongsToMany(Thread, { through: "UserThread" });
Thread.belongsToMany(User, { through: "UserThread" });