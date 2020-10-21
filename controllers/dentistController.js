const mongoose = require("mongoose");
const AppointmentModel = require("../models/appointment");
const userModel = require("../models/user");

const createAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.createAppointment");
    process.log.data(req.body);

    const appointmentDoc = await AppointmentModel.createAppointment(
      req.body,
      req.body.ClientId,
      req.user._id
    );

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

const cancelAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.cancelAppointment");
    process.log.data(req.body);

    const appointmentDoc = await AppointmentModel.cancelAppointment(
      req.body._id
    );

    res.send({ message: `${appointmentDoc.title} is cancelled.` });
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

const modifyAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.modifyAppointment");
    process.log.data(req.body);

    if (req.body.ClientId) await UserModel.getUserById(req.body.ClientId);
    const appointmentDoc = await AppointmentModel.modifyAppointment(
      { _id: req.body._id, DentistId: req.user._id },
      req.body
    );

    if (!appointmentDoc) {
      process.log.warning(
        " <- dentistController.modifyAppointment: appointment not found"
      );
      return res.status(400).send({ message: "appointment not found" });
    }

    res.send({ message: "appointment updated", appointmentDoc });
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

const acceptAppointment = async (req, res) => {
  try {
    process.log.debug(" -> dentistController.acceptAppointment");
    process.log.data(req.body);
    const appointmentDoc = await AppointmentModel.acceptAppointment(
      req.body._id
    );
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
    const appointmentDoc = await AppointmentModel.endAppointment(
      req.body._id
    );
    res.send({ message: `'${appointmentDoc.title}' is accepted.` });
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

    const user = await UserModel.update(req.user._id, req.body);

    process.log.debug(" <- dentistController.modifyAccountData");
    res.send({ message: `'${user.toObject().name}' has been updated.` });
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
  try {
    const query = {
      DentistId: req.user._id,
    };

    process.log.debug(" -> dentistController.watchHistoryOfAppointments");
    const appointmentWithClients = await AppointmentModel.getAllAppointments(
      query
    );
    process.log.debug(" <- dentistController.watchHistoryOfAppointments");
    res.send(appointmentWithClients);
  } catch (err) {
    process.log.error(
      " x- dentistController.watchHistoryOfAppointments Error:" + err.message
    );
    res.status(400).send({
      message: "Error on dentistController.watchHistoryOfAppointments",
      trace: err.message,
    });
  }
};

const watchHistoryOfAppointmentsFromPatient = async (req, res) => {
  try {
    const query = {
      ClientId: req.body.ClientId,
    };

    process.log.debug(" -> dentistController.watchHistoryOfAppointmentsFromPatient");
    const appointmentWithClients = await AppointmentModel.getAllAppointments(
      query
    );
    process.log.debug(" <- dentistController.watchHistoryOfAppointmentsFromPatient");
    res.send(appointmentWithClients);
  } catch (err) {
    process.log.error(
      " x- dentistController.watchHistoryOfAppointmentsFromPatient Error:" + err.message
    );
    res.status(400).send({
      message: "Error on dentistController.watchHistoryOfAppointmentsFromPatient",
      trace: err.message,
    });
  }
};

const watchHistoryOfAppointmentsBetweenDates = async (req, res) => {
  try {
    const query = {
      DentistId: req.user._id,
      date: {
        $gt: req.body.start,
        $lt: req.body.end,
      },
    };
    process.log.debug(
      " -> dentistController.watchHistoryOfAppointmentsBetweenDates"
    );
    const appointmentWithClients = await AppointmentModel.getAllAppointments(
      query
    );
    process.log.debug(
      " <- dentistController.watchHistoryOfAppointmentsBetweenDates"
    );
    res.send(appointmentWithClients);
  } catch (err) {
    process.log.error(
      " x- dentistController.watchHistoryOfAppointmentsBetweenDates Error:" +
        err.message
    );
    res.status(400).send({
      message:
        "Error on dentistController.watchHistoryOfAppointmentsBetweenDates",
      trace: err.message,
    });
  }
};

const deactivateAcount = async (req, res) => {
  try {
  
    process.log.debug(" -> dentistController.modifyAccountData");
    process.log.data(req.body);
    const updatedDoc = await userModel.softDelete(req.user._id);
    if (!updatedDoc) {
      process.log.warning(
        " <- dentistController.modifyAccountData: Unable to deactivate your profile"
      );
      return res.status(400).send({ message: `Unable to update your profile` });
    }

    const query = { DentistId: id, status: { $ne: 3 } };
    const set = { $set: { status: 0 } };
    const options = { multi: true };

    await AppointmentModel.cancelAppointmentsOnCascade(query, set, options);

    res.send({ message: `Account deactivated` });
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
