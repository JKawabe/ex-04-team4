const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { findUserById } = require("./user.service");
const session = require('express-session');
const secret = "secretKey";
const flash = require('connect-flash');

module.exports = function (app) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(new LocalStrategy({
      usernameField: "username",
      passwordField: "password",
    },async function(username, password, done) {
      try{
        let user = await User.findOne({
          where: {
            username,
          },
        });
        if(!user) {
          user = await User.findOne({
            where: {
              employee_id: username,
            },
          });
        }
        if(!user) {
            return done(null, false, {message: "Invalid User"});
        } else if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, {message: "Invalid User"});
        }
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  ));

  app.use(
    session({
      secret: secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
};