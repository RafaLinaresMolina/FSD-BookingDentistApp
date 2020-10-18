const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

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

const UserModel = mongoose.model("User", UserSchema, "Users");

module.exports = UserModel;
