const mongoose = require("mongoose");
const ClientModel = require("../models/client");
const UserModel = require("../models/client");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
    process.log.debug(" -> userController.register");
    process.log.data(req.body);
    const Client = mongoose.model("Clients", ClientModel.schema, "Users");
    const clientDoc = new Client(req.body);
    clientDoc.password = await bcrypt.hash(clientDoc.password, 9);
    await clientDoc.save();
    res.send(clientDoc);
    process.log.debug(" <- userController.register");
  } catch (err) {
    process.log.error(` x- userController.register ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on userController.register", trace: err });
  }
};

const isValidPassword = async (password, hashPasword) => {
  try {
    return await bcrypt.compare(password, hashPasword);
  } catch (err) {
    throw err;
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_AUTH_JWT, {
    expiresIn: "30d",
  });
};

const login = async (req, res) => {
  try {
    process.log.debug(" -> userController.login");
    process.log.data(req.body);

    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).message({ message: "Wrong credentials!" });
    }
    await isValidPassword(req.body.password, user.password);
    const token = generateToken({ _id: user._id, rolId: user.rolId });
    user.token = token;
    await user.save();
    res.send({ token: token });
    process.log.debug(" <- userController.login");
  } catch (err) {
    process.log.error(` x- userController.login ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on userController.login", trace: err });
  }
};

const logout = async (req, res) => {
  try {
    process.log.debug(" -> userController.logout");
    process.log.data(req.body);

    if(!req.headers.authorization){
      process.log.warning(`Token not present in headers`);
      return res.status(401).send({ message: 'Token not present in headers' })
    }

    const token = req.headers.authorization.split(' ')[1];

    const user = await UserModel.findOne({ token });
    if (!user) {
      return res.status(401).message({ message: "User already not logged." });
    }
    user.token = null;
    await user.save();
    res.send({ message: 'User logged out successfuly' });
    process.log.debug(" <- userController.logout");
  } catch (err) {
    process.log.error(` x- userController.logout ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on userController.logout", trace: err });
  }
};

module.exports = {
  register,
  login,
};
