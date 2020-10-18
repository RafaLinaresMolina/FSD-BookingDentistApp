const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');


const AdminSchema = mongoose.Schema({
  token: {
    type: String,
    default: "",
  },
  roleId: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
  address: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
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

const AdminModel = mongoose.model("Admin", AdminSchema, "Users");

module.exports = AdminModel;
