const mongoose = require("mongoose");
const UserModel = require("../models/user");
const tools = require('../lib/tools');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    process.log.debug(" -> authController.register");
    process.log.data(req.body);
    const User = mongoose.model(
      "User",
      UserModel.schema,
      'Users'
    );
    req.body.password = await bcrypt.hash(req.body.password, 9);
    const clientDoc = new User(req.body);
    await clientDoc.save();
    res.send(clientDoc);
    process.log.debug(" <- authController.register");
  } catch (err) {
    process.log.error(` x- authController.register ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on authController.register", trace: err });
  }
};

const login = async (req, res) => {
  try {
    process.log.debug(" -> authController.login");
    process.log.data(req.body);

    const user = await UserModel.checkCredentials(req.body);
    console.log(user)
    
    const isPassOk = await tools.isValidPassword(req.body.password, user.toObject().password)
    console.log(isPassOk, req.body.password, user.toObject().password)
    if(!isPassOk){
      process.log.debug(" <- authController.getUserData");
      return res.status(400).send({message: 'Error', trace: "Wrong credentials"})
    }
    const token = tools.generateToken({ _id: user._id, rolId: user.rolId });
    user.token = token;
    await user.save();
    res.send({ token: token });
    process.log.debug(" <- authController.login");
  } catch (err) {
    process.log.error(` x- authController.login ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on authController.login", trace: err.message });
  }
};

const getUserData = async (req, res) => {
  try {
    process.log.debug(" -> authController.getUserData");
    process.log.data(req.body);

    const user = await UserModel.findUserByToken(req.user.token);

    res.send({ name: user.name, lastName: user.lastName, roleId:user.roleId, email: user.email, address: user.address });
    process.log.debug(" <- authController.getUserData");
  } catch (err) {
    process.log.error(` x- authController.getUserData ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on authController.getUserData", trace: err.message });
  }
};

const logout = async (req, res) => {
  try {
    process.log.debug(" -> authController.logout");

    if (!req.headers.authorization) {
      process.log.warning(` <- authController.logout: Token not present in headers`);
      return res.status(401).send({ message: "Token not present in headers" });
    }

    const token = req.headers.authorization.split(" ")[1];

    await UserModel.logout(token);
    process.log.debug(" <- authController.logout");
    res.send({ message: "User logged out successfuly" });
    
  } catch (err) {
    process.log.error(` x- authController.logout ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on authController.logout", trace: err });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUserData,
};
