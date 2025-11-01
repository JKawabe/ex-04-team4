"use strict";
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { BOOLEAN } = require("sequelize");
const { getThreadById } = require("../threads/thread.service");

const findUser = async (username) => {
    return User.findOne({
        where: {
            username,
        }
    });
};

const findUserById = async (userId) => {
    return User.findOne({
        where: {
            id: userId,
        }
    });
};

const findUserByEmployeeId = async (employee_id) => {
    return User.findOne({
        where: {
            employee_id
        }
    });
};

const getAllUsers = async () => {
    const users = await User.findAll();
    return users;
};

const login = async (username, password) => {
    const user = findUser(username);
    if (!user) {
        throw new NotFoundException('ユーザーが存在しません');
    } else if (await bcrypt.compare(password, user.password)) {
        const payload = { username: user.username, sub: user.id };
        const accessToken = this.jwtService.sign(payload, {expiresIn: "1h"});
        return { accessToken };
    }
};

const createUser = async (username, employee_id, password, repassword) => {
    const user = await findUser(username);
    const user2 = await findUserByEmployeeId(employee_id);
    let error = undefined;
    if( user ) {
        error = "そのユーザー名はすでに使われています";
    } else if( user2 ) {
        error = "その社員IDはすでに使われています"
    } else if (password === repassword){
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        User.create({
            username,
            employee_id,
            password: hashedPassword,
            administrator: "normal",
            theme_color: "#326693",
        });
    } else {
        error = "パスワードが一致しません";
    }
    return error;
};

const createFirstAdminUser = async () => {
    const username = "administrator";
    const employee_id = "admin00";
    const password = "password";

    const adminUser = await User.findOne({
        where: {
            administrator: "admin",
        }
    })
    if(!adminUser) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        User.create({
            username,
            employee_id,
            password: hashedPassword,
            administrator: "admin",
            theme_color: "#326693",
        })
    }
}

const chacgeUsernameById = async (userid, username) => {
    const user = await findUser(username);
    const user2 = await findUserById(userid);
    let error = undefined;
    if(user && (user.id !== user2.id)){
        error = "そのユーザー名はすでに使われています";
    } else {
        User.update(
            { username },
            { where: { id: userid } }
        );
    }
    return error;
}

const changeAdminById = async (userid) => {
    const user = await findUserById(userid);
    if(user.administrator === "normal") {
        user.administrator = "admin";
        user.save();
    } else if(user.administrator === "admin") {
        user.administrator = "normal";
        user.save();
    } 
};

const deleteUserById = async (userid) => {
    User.destroy({
        where: {
            id: userid
        }
    });
};

const changeThemeColorById = async (userid, color) => {
    User.update(
        { theme_color: color },
        { where: { id: userid } }
    );
};

const addFavorite = async (userid, threadid) => {
    const thread = await getThreadById(threadid);
    const user = await findUserById(userid);
    const fav = await thread.getUsers({ where: { id: userid }});
    if(fav.length > 0) {
        await user.removeThread(threadid);
    } else {
        await user.addThread(thread);
    }
}

module.exports = {
  createUser,
  findUser,
  login,
  findUserById,
  getAllUsers,
  createFirstAdminUser,
  deleteUserById,
  changeAdminById,
  changeThemeColorById,
  chacgeUsernameById,
  addFavorite,
};
