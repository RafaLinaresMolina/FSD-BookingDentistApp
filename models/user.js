const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tools = require("../lib/tools");

const UserSchema = mongoose.Schema({
  token: {
    type: String,
    default: "",
  },
  roleId: {
    type: Number,
    default: 1,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        let emailRegex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/;
        return emailRegex.test(v);
      },
      message: "Provided email is invalid.",
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  password: {
    type: String,
    required: true,
  },
  covidPassed: {
    type: Boolean,
    default: false,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, 9);
  next();
});

UserSchema.statics.checkCredentials = async function (credentials) {
  try {
    const userDocument = await this.findOne({ email: credentials.email });
    if (!userDocument) {
      throw Error("User not found");
    }

    return userDocument;
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.getUserById = async function (id) {
  try {
    process.log.debug(" -> UserSchema.statics.userFound");
    const userDoc = await UserModel.findOne({ _id: id, status: { $ne: 0 } });
    if (!userDoc) {
      process.log.warning(" <- UserSchema.statics.userFound");
      throw new Error(`User with Id '${id}' not found`);
    }
    process.log.debug(" <- UserSchema.statics.userFound");
    return userDoc;
  } catch (err) {
    process.log.error(` x- UserSchema.statics.userFound: ${err.message}`);
    throw err;
  }
};

UserSchema.statics.findUserByToken = async function (token) {
  try {
    process.log.debug(" -> UserSchema.statics.findUserByToken");
    const userDoc = await UserModel.findOne({ token: token });
    if (!userDoc) {
      process.log.warning(" <- UserSchema.statics.findUserByToken");
      throw new Error(`User not found`);
    }
    process.log.debug(" <- UserSchema.statics.findUserByToken");
    return userDoc;
  } catch (err) {
    process.log.error(` x- UserSchema.statics.findUserByToken: ${err.message}`);
    throw err;
  }
};

UserSchema.statics.logout = async function (token) {
  try {
    const user = await this.findOne({ token: token });
    if (!user) {
      process.log.warning(` <- authController.logout: User already not logged.`);
      throw new Error("User already not logged.");
    }
    user.token = null;
    await user.save();
  } catch (err) {
    throw err;
  }
};

UserSchema.statics.getAllLoggedUsers = async function () {
  try {
    process.log.debug(" -> UserSchema.statics.getAllLoggedUsers");
    const userDoc = await UserModel.findOne({ token: { $ne: "" } });
    if (!userDoc) {
      process.log.warning(" <- UserSchema.statics.getAllLoggedUsers");
      throw new Error(`User with Id '${id}' not found`);
    }
    process.log.debug(" <- UserSchema.statics.getAllLoggedUsers");
    return userDoc;
  } catch (err) {
    process.log.error(
      ` x- UserSchema.statics.getAllLoggedUsers: ${err.message}`
    );
    throw err;
  }
};

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id, roleId: user.roleId }, process.env.SECRET_AUTH_JWT, {
    expiresIn: "30d",
  });
  return token;
};

UserSchema.statics.update = async function(id, data){
  const userDocument = await UserModel.findOneAndUpdate({_id: id}, data).exec(); 
    if (!userDocument) {
      process.log.warning(
        " <- UserSchema.statics.update: Unable to update your profile"
      );
      throw new Error(`Unable to update your profile`);
    }
    process.log.debug(" <- UserSchema.statics.update");
    return userDocument;
  
}

UserSchema.statics.softDelete = async function(id){
  const userDocument = await UserModel.findOneAndUpdate({_id: id}, {status: 0, token: ""}).exec(); 
    if (!userDocument) {
      process.log.warning(
        " <- UserSchema.statics.softDelete: Unable to update your profile"
      );
      throw new Error(`Unable to update your profile`);
    }
    process.log.debug(" <- UserSchema.statics.softDelete");
    return userDocument;
  
}

UserSchema.statics.getLoggedUsers = async function(){
  const userDocument = await UserModel.find({status: {$ne: 0}, token: {$ne: ""}}); 
  return userDocument ? userDocument : [];   
}

UserSchema.statics.kickUser = async function(id){
  const userDocument = await UserModel.findOneAndUpdate({_id: id}, {token: ""}).exec(); 
  if (!userDocument) {
    process.log.warning(
      " <- UserSchema.statics.kickUser: Unable to kick the user"
    );
    throw new Error(`Unable to kick the user`);
  }
  process.log.debug(" <- UserSchema.statics.kickUser");
  return userDocument;
}

UserSchema.statics.changeRoleId = async function(id, roleId){
  const userDocument = await UserModel.findOneAndUpdate({_id: id}, {roleId, token: ""}).exec(); 
    if (!userDocument) {
      process.log.warning(
        " <- UserSchema.statics.softDelete: Unable to update your profile"
      );
      throw new Error(`Unable to update your profile`);
    }
    process.log.debug(" <- UserSchema.statics.softDelete");
    return userDocument;
  
}

const UserModel = mongoose.model("User", UserSchema, "Users");

module.exports = UserModel;
