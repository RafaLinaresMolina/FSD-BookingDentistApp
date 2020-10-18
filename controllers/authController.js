const mongoose = require("mongoose");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    process.log.debug(" -> authController.register");
    process.log.data(req.body);
    const Client = mongoose.model(
      "Clients",
      UserModel.schema,
      'Users'
    );
    const clientDoc = new Client(req.body);
    clientDoc.password = await bcrypt.hash(clientDoc.password, 9);
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

const isValidPassword = async (password, hashPasword) => {
  try {
    const isOk = await bcrypt.compare(password, hashPasword);
    process.log.debug(`Password Match ? ${isOk}`)
    return isOk;
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
    process.log.debug(" -> authController.login");
    process.log.data(req.body);

    const user = await UserModel.findOne({ email: req.body.email, status: 1 });
    if (!user) {
      process.log.warning(` <- authController.login: Wrong credentials!`);
      return res.status(401).send({ message: "Wrong credentials!" });
    }

    await isValidPassword(req.body.password, user.toJSON().password);
    const token = generateToken({ _id: user._id, rolId: user.rolId });
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

const logout = async (req, res) => {
  try {
    process.log.debug(" -> authController.logout");

    if (!req.headers.authorization) {
      process.log.warning(` <- authController.logout: Token not present in headers`);
      return res.status(401).send({ message: "Token not present in headers" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const user = await UserModel.findOne({ token });
    if (!user) {
      process.log.warning(` <- authController.logout: User already not logged.`);
      return res.status(401).message({ message: "User already not logged." });
    }
    user.token = null;
    await user.save();
    res.send({ message: "User logged out successfuly" });
    process.log.debug(" <- authController.logout");
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
};
