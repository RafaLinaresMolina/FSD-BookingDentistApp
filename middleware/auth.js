const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const error403 = `I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource.`;
const error401 = `I don't know who you are or what you want, go away please.`;

const auth = {
  async loggedRequired(req, res, next) {
    try {
      if(!req.headers.authorization){
        process.log.warning(`Token not present in headers`);
        return res.status(401).send({ message: error401 })
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_AUTH_JWT);

      const user = await UserModel.findOne({token: token, status: {$ne: 0}});
      if (!user) {
        return res.status(401).send({ message: error401 });
      }
      req.user = user;
      next();
    } catch (error) {
      process.log.error(error.message);
      res.status(401).send({ message: error401 });
    }
  },
  
  async adminRequired(req, res, next) {
    try {
      process.log.data(req.user.roleId);
      if (![0].includes(req.user.roleId)) {
        return res.status(403).send({ message: error403 });
      }
      next();
    } catch (error) {
      process.log.error(error.message);
      res.status(403).send({ message: error403 });
    }
  },

  async dentistRequired(req, res, next) {
    try {
      if (![2].includes(req.user.roleId)) {
        return res.status(403).send({ message: error403 });
      }
      next();
    } catch (error) {
      process.log.error(error.message);
      res.status(403).send({ message: error403 });
    }
  },
};

module.exports = auth;
