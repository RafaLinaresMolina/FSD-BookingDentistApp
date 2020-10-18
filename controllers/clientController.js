const mongoose = require("mongoose");
const AppointmentModel = require("../models/appointment");
const userModel = require("../models/user");
const ClientModel = require("../models/client");
const {
  isDateAlreadyTaken,
  isMorningShift,
  isNightShift,
  isWeekend,
} = require("../lib/tools");
const tools = require('../lib/tools');

const createAppointment = async (req, res) => {
  try {
    process.log.debug(" -> clientController.createAppointment");
    process.log.data(req.body);
    const Appointment = await mongoose.model(
      "Appointments",
      AppointmentModel.schema,
      "Appointments"
    );
    const appointmentDoc = new Appointment(req.body);

    await isDateAlreadyTaken(appointmentDoc.date);
    isMorningShift(appointmentDoc.date);
    isNightShift(appointmentDoc.date);
    isWeekend(appointmentDoc.date);

    appointmentDoc.ClientId = req.user._id;
    await appointmentDoc.save();
    res.send(appointmentDoc);
    process.log.debug(" <- clientController.createAppointment");
  } catch (err) {
    process.log.error(
      ` x- clientController.createAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on clientController.createAppointment",
      trace: err.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    process.log.debug(" -> clientController.cancelAppointment");
    process.log.data(req.body);
    const appointmentDoc = await AppointmentModel.findById(req.body._id, {
      ClientId: req.user._id,
    });
    if (!appointmentDoc) {
      process.log.warning(
        " <- clientController.cancelAppointment: appointment not found"
      );
      return res.status(400).send({ message: `appointment not found` });
    }
    appointmentDoc.status = 0;
    await appointmentDoc.save();
    res.send({ message: `${appointmentDoc.title} is cancelled.` });
    process.log.debug(" <- clientController.cancelAppointment");
  } catch (err) {
    process.log.error(
      ` x- clientController.cancelAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on clientController.cancelAppointment",
      trace: err.message,
    });
  }
};

const modifyAccountData = async (req, res) => {
  try {
    process.log.debug(" -> clientController.modifyAccountData");
    process.log.data(req.body);
    ClientModel.findOneAndUpdate(
      {_id: req.user._id},
      req.body,
      (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- clientController.modifyAccountData: Unable to update your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(" <- clientController.modifyAccountData");
        res.send({ message: `${updatedDoc.name} has been updated.` });
      }
    );
  } catch (err) {
    process.log.error(
      ` x- clientController.modifyAccountData ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on clientController.modifyAccountData",
      trace: err.message,
    });
  }
};

const watchHistoryOfAppointments = async (req, res) => {
  process.log.debug(" -> clientController.watchHistoryOfAppointments");

  const appointmentDocs = await AppointmentModel.find({
    ClientId: req.user._id,
  });
  if (!appointmentDocs) {
    process.log.warning(
      " <- clientController.watchHistoryOfAppointments: Unable to retrive the appointments"
    );
    return res
      .status(400)
      .send({ message: `Unable to retrive the appointments` });
  }

  let plainJsonArray = await appointmentDocs.map(element => element.toJSON());
  let appointmentWithClients = await tools.AppointmentRelations(['Client', 'Dentist'],plainJsonArray)
  appointmentWithClients = await Promise.all(appointmentWithClients)
  process.log.debug(" <- clientController.watchHistoryOfAppointments");
  res.send(appointmentWithClients);
};

const watchHistoryOfAppointmentsBetweenDates = async (req, res) => {
  const appointmentDocs = await AppointmentModel.find({
    ClientId: req.user._id,
    date: {
      $gt: req.body.start,
      $lt: req.body.end,
    },
  });
  if (!appointmentDocs) {
    process.log.warning(
      " <- clientController.watchHistoryOfAppointments: Unable to retrive the appointments"
    );
    return res
      .status(400)
      .send({ message: `Unable to retrive the appointments` });
  }

  let plainJsonArray = await appointmentDocs.map(element => element.toJSON());
  let appointmentWithClients = await tools.AppointmentRelations(['Client', 'Dentist'],plainJsonArray)
  appointmentWithClients = await Promise.all(appointmentWithClients)
  process.log.debug(" <- clientController.watchHistoryOfAppointments");
  res.send(appointmentWithClients);
};

const deactivateAcount = async (req, res) => {
  try {
    process.log.debug(" -> clientController.modifyAccountData");
    process.log.data(req.body);
    await userModel.findByIdAndUpdate(
      req.user._id,
      { status: 0, token: "" },
      async (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- clientController.modifyAccountData: Unable to deactivate your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(
          " <- clientController.modifyAccountData: user status set to 0"
        );

        await AppointmentModel.updateMany(
          { ClientId: req.user._id, status: { $ne: 3 } },
          { $set: { status: 0 } },
          { multi: true },
          (err, updatedDocuments) => {
            if (err) {
              process.log.warning(
                " <- clientController.modifyAccountData: Unable to deactivate your active appointments"
              );
              return res.status(400).send({
                message: `Unable to deactivate your active appointments`,
              });
            }
            process.log.debug(
              " <- clientController.modifyAccountData: user active appointments status set to 0"
            );
            res.send({ message: `Account deactivated` });
          }
        );
      }
    );
  } catch (err) {
    process.log.error(
      ` x- clientController.modifyAccountData ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on clientController.modifyAccountData",
      trace: err.message,
    });
  }
};

module.exports = {
  createAppointment,
  cancelAppointment,
  modifyAccountData,
  deactivateAcount,
  watchHistoryOfAppointments,
  watchHistoryOfAppointmentsBetweenDates,
};
