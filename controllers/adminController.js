const AppointmentModel = require("../models/appointment");
const tools = require("../lib/tools");
const UserModel = require("../models/user");

const createAppointment = async (req, res) => {
  try {
    process.log.debug(" -> adminController.createAppointment");
    process.log.data(req.body);

    if (!req.body.ClientId || !req.body.DentistId) {
      return res
        .status(400)
        .send({
          message: "missing Client or Dentist for create the appointment",
        });
    }

    if (req.body.ClientId) await UserModel.getUserById(req.body.ClientId);
    if (req.body.DentistId) await UserModel.getUserById(req.body.DentistId);

    const appointmentDoc = await AppointmentModel.createAppointment(
      req.body,
      req.body.ClientId,
      req.body.DentistId
    );

    res.send(appointmentDoc);
    process.log.debug(" <- adminController.createAppointment");
  } catch (err) {
    process.log.error(
      ` x- adminController.createAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.createAppointment",
      trace: err.message,
    });
  }
};

const modifyAppointment = async (req, res) => {
  try {
    process.log.debug(" -> adminController.modifyAppointment");
    process.log.data(req.body);

    if (req.body.ClientId) await UserModel.getUserById(req.body.ClientId);
    if (req.body.DentistId) await UserModel.getUserById(req.body.DentistId);

    const appointmentDoc = await AppointmentModel.modifyAppointment(
      { _id: req.body._id},
      req.body
    );

    res.send({ message: "appointment updated", appointmentDoc });
  } catch (err) {
    process.log.error(
      ` x- adminController.modifyAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.modifyAppointment",
      trace: err.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    process.log.debug(" -> adminController.cancelAppointment");
    process.log.data(req.body);

    const appointmentDoc = await AppointmentModel.cancelAppointment(
      req.body._id
    );

    res.send({ message: `${appointmentDoc.title} is cancelled.` });
    process.log.debug(" <- adminController.cancelAppointment");
  } catch (err) {
    process.log.error(
      ` x- adminController.cancelAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.cancelAppointment",
      trace: err.message,
    });
  }
};

const acceptAppointment = async (req, res) => {
  try {
    process.log.debug(" -> adminController.acceptAppointment");
    process.log.data(req.body);
    const appointmentDoc = await AppointmentModel.acceptAppointment(
      req.body._id
    );
    res.send({ message: `'${appointmentDoc.title}' is accepted.` });
    process.log.debug(" <- adminController.acceptAppointment");
  } catch (err) {
    process.log.error(
      ` x- adminController.acceptAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.acceptAppointment",
      trace: err.message,
    });
  }
};

const endAppointment = async (req, res) => {
  try {
    process.log.debug(" -> adminController.endAppointment");
    process.log.data(req.body);
    const appointmentDoc = await AppointmentModel.endAppointment(
      req.body._id
    );
    res.send({ message: `'${appointmentDoc.title}' is accepted.` });
    process.log.debug(" <- adminController.endAppointment");
  } catch (err) {
    process.log.error(
      ` x- adminController.endAppointment ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.endAppointment",
      trace: err.message,
    });
  }
};

const modifyAccountData = async (req, res) => {
  try {
    process.log.debug(" -> adminController.modifyAccountData");
    process.log.data(req.body);

    const user = await UserModel.update(req.user._id, req.body);

    process.log.debug(" <- adminController.modifyAccountData");
    res.send({ message: `'${user.toObject().name}' has been updated.` });
  } catch (err) {
    process.log.error(
      ` x- adminController.modifyAccountData ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.modifyAccountData",
      trace: err.message,
    });
  }
};

const modifyAccountDataForUser = async (req, res) => {
  try {
    process.log.debug(" -> adminController.modifyAccountDataForUser");
    process.log.data(req.body);

    const user = await UserModel.update(req.body._id, req.body);

    process.log.debug(" <- adminController.modifyAccountDataForUser");
    res.send({ message: `'${user.toObject().name}' has been updated.` });
  } catch (err) {
    process.log.error(
      ` x- adminController.modifyAccountDataForUser ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.modifyAccountDataForUser",
      trace: err.message,
    });
  }
};

const changeRoleToDentist = async (req, res) => {
  try {
    process.log.debug(" -> adminController.changeRoleForDentist");
    process.log.data(req.body);
    await UserModel.changeRoleId(req.body._id, 2);

    process.log.debug(" <- adminController.changeRoleForDentist");
    res.send({ message: `${updatedDoc.name} has been updated.` });
      
  } catch (err) {
    process.log.error(
      ` x- adminController.changeRoleForDentist ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.changeRoleForDentist",
      trace: err.message,
    });
  }
};

const changeRoleToAdmin = async (req, res) => {
  try {
    process.log.debug(" -> adminController.changeRoleToAdmin");
    process.log.data(req.body);
    await UserModel.changeRoleId(req.body._id, 0);

    process.log.debug(" <- adminController.changeRoleToAdmin");
    res.send({ message: `${updatedDoc.name} has been updated.` });
      
  } catch (err) {
    process.log.error(
      ` x- adminController.changeRoleToAdmin ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.changeRoleToAdmin",
      trace: err.message,
    });
  }
};

const changeRoleToClient = async (req, res) => {
  try {
    process.log.debug(" -> adminController.changeRoleToClient");
    process.log.data(req.body);
    await UserModel.changeRoleId(req.body._id, 1);

    process.log.debug(" <- adminController.changeRoleToClient");
    res.send({ message: `${updatedDoc.name} has been updated.` });
      
  } catch (err) {
    process.log.error(
      ` x- adminController.changeRoleToClient ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.changeRoleToClient",
      trace: err.message,
    });
  }
};

const watchHistoryOfDentistAppointments = async (req, res) => {
  try {
    const query = {
      DentistId: req.body.DentistId,
    };

    process.log.debug(" -> adminController.watchHistoryOfDentistAppointments");
    const appointmentWithClients = await AppointmentModel.getAllAppointments(
      query
    );
    process.log.debug(" <- adminController.watchHistoryOfDentistAppointments");
    res.send(appointmentWithClients);
  } catch (err) {
    process.log.error(
      " x- adminController.watchHistoryOfDentistAppointments Error:" + err.message
    );
    res.status(400).send({
      message: "Error on adminController.watchHistoryOfDentistAppointments",
      trace: err.message,
    });
  }
};

const watchHistoryOfClientAppointments = async (req, res) => {
  try {
    const query = {
      ClientId: req.body.ClientId,
    };

    process.log.debug(" -> adminController.watchHistoryOfClientAppointments");
    const appointmentWithClients = await AppointmentModel.getAllAppointments(
      query
    );
    process.log.debug(" <- adminController.watchHistoryOfClientAppointments");
    res.send(appointmentWithClients);
  } catch (err) {
    process.log.error(
      " x- adminController.watchHistoryOfClientAppointments Error:" + err.message
    );
    res.status(400).send({
      message: "Error on adminController.watchHistoryOfClientAppointments",
      trace: err.message,
    });
  }
};

const watchHistoryOfAppointmentsBetweenDates = async (req, res) => {
  try {
    const query = {
      date: {
        $gt: req.body.start,
        $lt: req.body.end,
      },
    };
    process.log.debug(
      " -> adminController.watchHistoryOfAppointmentsBetweenDates"
    );
    const appointmentWithClients = await AppointmentModel.getAllAppointments(
      query
    );
    process.log.debug(
      " <- adminController.watchHistoryOfAppointmentsBetweenDates"
    );
    res.send(appointmentWithClients);
  } catch (err) {
    process.log.error(
      " x- adminController.watchHistoryOfAppointmentsBetweenDates Error:" +
        err.message
    );
    res.status(400).send({
      message:
        "Error on adminController.watchHistoryOfAppointmentsBetweenDates",
      trace: err.message,
    });
  }
};

const deactivateAcount = async (req, res) => {
  try {
  
    process.log.debug(" -> adminController.modifyAccountData");
    process.log.data(req.body);
    const updatedDoc = await userModel.softDelete(req.user._id);
    if (!updatedDoc) {
      process.log.warning(
        " <- adminController.modifyAccountData: Unable to deactivate your profile"
      );
      return res.status(400).send({ message: `Unable to update your profile` });
    }
    res.send({ message: `Account deactivated` });
  } catch (err) {
    process.log.error(
      ` x- adminController.modifyAccountData ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.modifyAccountData",
      trace: err.message,
    });
  }
};

const usersLogged = async (req, res) => {
  try {
    process.log.debug(" -> adminController.usersLogged");
    const userDocs = await UserModel.find({ token: { $ne: "" } });
    if (!userDocs) {
      process.log.warning(" <- adminController.usersLogged: no one is logged");
      return res.status(400).send({ message: `appointment not found` });
    }
    process.log.data(userDocs);
    res.send(userDocs);
    process.log.debug(" <- adminController.usersLogged");
  } catch (err) {
    process.log.error(` x- adminController.usersLogged ERROR: ${err.message}`);
    res.status(500).send({
      message: "Error on adminController.usersLogged",
      trace: err.message,
    });
  }
};

const kickUser = async (req, res) => {
  try {
    process.log.debug(" -> adminController.kickUser");
    const appointmentDoc = await UserModel.kickUser(req.body._id);
    if (!appointmentDoc) {
      process.log.warning(" <- adminController.usersLogged: no one is logged");
      return res.status(400).send({ message: `appointment not found` });
    }
    process.log.data(appointmentDoc);
    res.send(appointmentDoc);
    process.log.debug(" <- adminController.kickUser");
  } catch (err) {
    process.log.error(` x- adminController.kickUser ERROR: ${err.message}`);
    res.status(500).send({
      message: "Error on adminController.kickUser",
      trace: err.message,
    });
  }
};

module.exports = {
  createAppointment,
  cancelAppointment,
  acceptAppointment,
  endAppointment,
  modifyAppointment,

  modifyAccountData,
  modifyAccountDataForUser,
  deactivateAcount,

  changeRoleToClient,
  changeRoleToDentist,
  changeRoleToAdmin,

  watchHistoryOfDentistAppointments,
  watchHistoryOfClientAppointments,
  watchHistoryOfAppointmentsBetweenDates,

  usersLogged,
  kickUser
};
