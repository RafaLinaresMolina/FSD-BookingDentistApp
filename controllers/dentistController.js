const mongoose = require("mongoose");
const AppointmentModel = require("../models/appointment");
const userModel = require("../models/user");
const dentistModel = require("../models/dentist");
const tools = require("../lib/tools");

const createAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.createAppointment");
    process.log.data(req.body);
    const Appointment = await mongoose.model(
      "Appointments",
      AppointmentModel.schema,
      "Appointments"
    );

    if (req.body.ClientId) await tools.userFound(req.body.ClientId);

    const newAppointment = req.body;
    newAppointment.DentistId = req.user._id;
    newAppointment.status = 2;

    const appointmentDoc = new Appointment(newAppointment);

    await tools.isDateAlreadyTaken(appointmentDoc.date);
    tools.isMorningShift(appointmentDoc.date);
    tools.isNightShift(appointmentDoc.date);
    tools.isWeekend(appointmentDoc.date);

    await appointmentDoc.save();
    res.send(appointmentDoc);
    process.log.debug(" <- dentistController.createAppointment");
  } catch (err) {
    process.log.error(
      ` x- dentistController.createAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on dentistController.createAppointment",
      trace: err.message,
    });
  }
};

const modifyAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.modifyAppointment");
    process.log.data(req.body);

    if (req.body.ClientId) await tools.userFound(req.body.ClientId);

    await AppointmentModel.findOneAndUpdate(
      { _id: req.body._id, DentistId: req.user._id },
      req.body,
      (err, appointmentDoc) => {
        if (err) {
          process.log.warning(
            " <- dentistController.modifyAppointment: appointment not found"
          );
          return res.status(400).send({ message: "appointment not found" });
        }

        res.send({ message: "appointment updated", appointmentDoc });
      }
    );
  } catch (err) {
    process.log.error(
      ` x- dentistController.modifyAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on dentistController.modifyAppointment",
      trace: err.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.cancelAppointment");
    process.log.data(req.body);

    const appointmentDoc = await AppointmentModel.findOne({
      _id: req.body._id,
      DentistId: req.user._id,
    });
    if (!appointmentDoc) {
      process.log.warning(
        " <- dentistController.cancelAppointment: appointment not found"
      );
      return res.status(400).send({ message: `appointment not found` });
    }
    process.log.data(appointmentDoc);
    appointmentDoc.status = 0;
    await appointmentDoc.save();
    res.send({ message: ` '${appointmentDoc.title}' is cancelled.` });
    process.log.debug(" <- dentistController.cancelAppointment");
  } catch (err) {
    process.log.error(
      ` x- dentistController.cancelAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on dentistController.cancelAppointment",
      trace: err.message,
    });
  }
};

const acceptAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.acceptAppointment");
    process.log.data(req.body);
    const appointmentDoc = await AppointmentModel.findOne({
      _id: req.body._id,
      DentistId: req.user._id,
    });
    if (!appointmentDoc) {
      process.log.warning(
        " <- dentistController.acceptAppointment: appointment not found"
      );
      return res.status(400).send({ message: `appointment not found` });
    }
    process.log.data(appointmentDoc);
    appointmentDoc.status = 2;
    await appointmentDoc.save();
    res.send({ message: `'${appointmentDoc.title}' is accepted.` });
    process.log.debug(" <- dentistController.acceptAppointment");
  } catch (err) {
    process.log.error(
      ` x- dentistController.acceptAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on dentistController.acceptAppointment",
      trace: err.message,
    });
  }
};

const endAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.endAppointment");
    process.log.data(req.body);
    const appointmentDoc = await AppointmentModel.findById(req.body._id, {
      DentistId: req.user._id,
    });
    if (!appointmentDoc) {
      process.log.warning(
        " <- dentistController.endAppointment: appointment not found"
      );
      return res.status(400).send({ message: `appointment not found` });
    }
    appointmentDoc.status = 3;
    await appointmentDoc.save();
    res.send({ message: `${appointmentDoc.title} is cancelled.` });
    process.log.debug(" <- dentistController.endAppointment");
  } catch (err) {
    process.log.error(
      ` x- dentistController.endAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on dentistController.endAppointment",
      trace: err.message,
    });
  }
};

const modifyAccountData = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.modifyAccountData");
    process.log.data(req.body);
    await AppointmentModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- dentistController.modifyAccountData: Unable to update your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(" <- dentistController.modifyAccountData");
        res.send({ message: `${updatedDoc.name} has been updated.` });
      }
    );
  } catch (err) {
    process.log.error(
      ` x- dentistController.modifyAccountData ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on dentistController.modifyAccountData",
      trace: err.message,
    });
  }
};

const watchHistoryOfAppointments = async (req, res) => {
  process.log.debug(" -> dentistController.watchHistoryOfAppointments");

  const appointmentDocs = await AppointmentModel.find({
    DentistId: req.user._id,
  });
  if (!appointmentDocs) {
    process.log.warning(
      " <- dentistController.watchHistoryOfAppointments: Unable to retrive the appointments"
    );
    return res
      .status(400)
      .send({ message: `Unable to retrive the appointments` });
  }
  process.log.debug(" <- dentistController.watchHistoryOfAppointments");
  res.send(appointmentDocs);
};

const watchHistoryOfAppointmentsFromPatient = async (req, res) => {
  process.log.debug(
    " -> dentistController.watchHistoryOfAppointmentsFromPatient"
  );

  const appointmentDocs = await AppointmentModel.find({
    ClientId: req.body.ClientId,
  });
  if (!appointmentDocs) {
    process.log.warning(
      " <- dentistController.watchHistoryOfAppointmentsFromPatient: Unable to retrive the appointments"
    );
    return res
      .status(400)
      .send({ message: `Unable to retrive the appointments` });
  }
  process.log.debug(
    " <- dentistController.watchHistoryOfAppointmentsFromPatient"
  );
  res.send(appointmentDocs);
};

const watchHistoryOfAppointmentsBetweenDates = async (req, res) => {
  process.log.debug(
    " -> dentistController.watchHistoryOfAppointmentsFromPatient"
  );
  process.log.data(req.user._id);
  const appointmentDocs = await AppointmentModel.find({
    DentistId: req.user._id,
    date: {
      $gt: req.body.start,
      $lt: req.body.end,
    },
  });
  if (!appointmentDocs) {
    process.log.warning(
      " <- dentistController.watchHistoryOfAppointmentsBetweenDates: Unable to retrive the appointments"
    );
    return res
      .status(400)
      .send({ message: `Unable to retrive the appointments` });
  }
  process.log.debug(
    " <- dentistController.watchHistoryOfAppointmentsBetweenDates"
  );
  res.send(appointmentDocs);
};

const deactivateAcount = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.modifyAccountData");
    process.log.data(req.body);
    await userModel.findByIdAndUpdate(
      req.user._id,
      { status: 0, token: null },
      async (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- dentistController.modifyAccountData: Unable to deactivate your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(
          " <- dentistController.modifyAccountData: user status set to 0"
        );

        await AppointmentModel.updateMany(
          { DentistId: req.user._id, status: { $ne: 3 } },
          { $set: { status: 0 } },
          { multi: true },
          (err, updatedDocuments) => {
            if (err) {
              process.log.warning(
                " <- dentistController.modifyAccountData: Unable to deactivate your active appointments"
              );
              return res.status(400).send({
                message: `Unable to deactivate your active appointments`,
              });
            }
            process.log.debug(
              " <- dentistController.modifyAccountData: user active appointments status set to 0"
            );
            res.send({ message: `Account deactivated` });
          }
        );
      }
    );
  } catch (err) {
    process.log.error(
      ` x- dentistController.modifyAccountData ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on dentistController.modifyAccountData",
      trace: err.message,
    });
  }
};

module.exports = {
  createAppointment,
  cancelAppointment,
  acceptAppointment,
  endAppointment,
  modifyAccountData,
  deactivateAcount,
  modifyAppointment,
  watchHistoryOfAppointments,
  watchHistoryOfAppointmentsFromPatient,
  watchHistoryOfAppointmentsBetweenDates,
};
