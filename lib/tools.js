const AppointmentModel = require("../models/appointment");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const isMorningShift = (date) => {
  const start = 8 * 60 + 00;
  const end = 14 * 60 + 0;
  const time = date.getHours() * 60 + date.getMinutes();
  if (time < start && time >= end) {
    throw new Error("We only work from 8AM to 14PM, and from 15PM to 18PM");
  }
};

const isNightShift = (date) => {
  const start = 15 * 60 + 30;
  const end = 18 * 60 + 0;
  const time = date.getHours() * 60 + date.getMinutes();
  if (time < start && time >= end) {
    throw new Error("We only work from 8AM to 14PM, and from 15PM to 18PM");
  }
};

const isDateAlreadyTaken = async (date) => {
  try {
    const appointment = await AppointmentModel.findOne({
      status: 0,
      date: new Date(date).toISOString(),
    });
    if (appointment) {
      throw new Error("The date is already taken.");
    }
  } catch (err) {
    throw err;
  }
};

const isWeekend = (date) => {
  const dateObj = new Date(date);
  if ([0, 6].includes(dateObj.getDay())) {
    throw new Error("We do not work on weekends.");
  }
};

const AppointmentRelations = async (collections, appointmentsDoc) => {
  try {
    return appointmentsDoc.map(async (element) => {
      for (const collection of collections) {
        delete element.__v;
        if(element[collection + "Id"]){
          const user = await userFound(element[collection + "Id"]);
          const plainUser = user.toObject();
          delete plainUser.password;
          delete plainUser.token;
          delete plainUser.roleId;
          delete plainUser._id;
          delete plainUser.__v;
          element[collection] = plainUser;
        }
      }
      return element;
    });
  } catch (err) {
    throw err;
  }
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_AUTH_JWT, {
    expiresIn: "30d",
  });
};
const isValidPassword = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (err) {
    throw err;
  }
};


module.exports = {
  isMorningShift,
  isNightShift,
  isDateAlreadyTaken,
  isWeekend,
  isValidPassword,
  generateToken,
  AppointmentRelations,
};
