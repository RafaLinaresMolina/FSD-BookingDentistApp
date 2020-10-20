const AppointmentModel = require("../models/appointment");
const userModel = require("../models/user");
const tools = require("../lib/tools");
const UserModel = require("../models/user");

const createAppointment = async (req, res) => {
  try {
    process.log.debug(" -> clientController.createAppointment");
    process.log.data(req.body);

    const appointmentDoc = await AppointmentModel.createAppointment(
      req.body,
      req.user._id
    );

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

    const appointmentDoc = await AppointmentModel.cancelAppointment(
      req.body._id
    );

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

    const user = await UserModel.update(req.user._id, req.body);

    process.log.debug(" <- clientController.modifyAccountData");
    res.send({ message: `'${user.toObject().name}' has been updated.` });
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
  try {
    process.log.debug(" -> clientController.watchHistoryOfAppointments");
    const appointmentWithClients = await AppointmentModel.getAllAppointments(
      "Client",
      req.user._id
    );
    process.log.debug(" <- clientController.watchHistoryOfAppointments");
    res.send(appointmentWithClients);
  } catch (err) {
    process.log.error(
      " x- clientController.watchHistoryOfAppointments Error:" + err.message
    );
    res.status(400).send({
      message: "Error on clientController.watchHistoryOfAppointments",
      trace: err.message,
    });
  }
};

const watchHistoryOfAppointmentsBetweenDates = async (req, res) => {
  try {
    process.log.debug(
      " -> clientController.watchHistoryOfAppointmentsBetweenDates"
    );
    const appointmentWithClients = await AppointmentModel.getAllAppointmentsBetweenDates(
      "Client",
      req.user._id,
      req.body.start,
      req.body.end
    );
    process.log.debug(
      " <- clientController.watchHistoryOfAppointmentsBetweenDates"
    );
    res.send(appointmentWithClients);
  } catch (err) {
    process.log.error(
      " x- clientController.watchHistoryOfAppointmentsBetweenDates Error:" +
        err.message
    );
    res.status(400).send({
      message:
        "Error on clientController.watchHistoryOfAppointmentsBetweenDates",
      trace: err.message,
    });
  }
};

const deactivateAcount = async (req, res) => {
  try {
    process.log.debug(" -> clientController.modifyAccountData");
    process.log.data(req.body);
    const updatedDoc = await userModel.softDelete(req.user._id);
    if (!updatedDoc) {
      process.log.warning(
        " <- clientController.modifyAccountData: Unable to deactivate your profile"
      );
      return res.status(400).send({ message: `Unable to update your profile` });
    }

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
