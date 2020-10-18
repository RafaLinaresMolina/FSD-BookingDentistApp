const AppointmentModel = require("../models/appointment");
const UserModel = require("../models/user");
const AdminModel = require("../models/admin");
const ClientModel = require("../models/client");
const DentistModel = require("../models/dentist");

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
    const dateString = new Date(date).toISOString();
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

const userFound = async (id) => {
  try {
    process.log.debug(" -> adminController.userFound");
    const userDoc = await UserModel.findById(id, { status: { $ne: 0 } });
    if (!userDoc) {
      process.log.warning(" <- adminController.userFound");
      throw new Error(`User with Id '${id}' not found`);
    }
    process.log.debug(" <- adminController.userFound");
  } catch (err) {
    process.log.error(` x- adminController.userFound: ${err.message}`);
    throw err;
  }
};

const getModelByRole = (roleId) => {
  const models = {
    0: AdminModel,
    1: ClientModel,
    2: DentistModel,
  };
  return models[roleId];
};

module.exports = {
  isMorningShift,
  isNightShift,
  isDateAlreadyTaken,
  isWeekend,
  userFound,
};
