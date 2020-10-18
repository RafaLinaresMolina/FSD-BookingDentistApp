const mongoose = require("mongoose");
const AppointmentModel = require("../models/appointment");
const userModel = require("../models/user");
const tools = require("../lib/tools");
const UserModel = require("../models/user");

const createAppointment = async (req, res) => {
  try {
    process.log.debug(" -> adminController.createAppointment");
    process.log.data(req.body);
    const Appointment = await mongoose.model(
      "Appointments",
      AppointmentModel.schema,
      "Appointments"
    );

    if (req.body.ClientId) await tools.userFound(req.body.ClientId);
    if (req.body.DentistId) await tools.userFound(req.body.DentistId);

    const appointmentDoc = new Appointment(req.body);

    await tools.isDateAlreadyTaken(appointmentDoc.date);
    tools.isMorningShift(appointmentDoc.date);
    tools.isNightShift(appointmentDoc.date);
    tools.isWeekend(appointmentDoc.date);

    await appointmentDoc.save();
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

    if (req.body.ClientId) await tools.userFound(req.body.ClientId);
    if (req.body.DentistId) await tools.userFound(req.body.DentistId);

    await AppointmentModel.findByIdAndUpdate(
      req.body._id,
      {
        ClientId: req.body.ClientId,
        DentistId: req.user.DentistId,
      },
      req.body,
      (err, appointmentDoc) => {
        if (err) {
          process.log.warning(
            " <- adminController.modifyAppointment: appointment not found"
          );
          return res.status(400).send({ message: "appointment not found" });
        }

        res.send({ message: "appointment updated" });
      }
    );
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
    const appointmentDoc = await AppointmentModel.findById(req.body._id);
    if (!appointmentDoc) {
      process.log.warning(
        " <- adminController.cancelAppointment: appointment not found"
      );
      return res.status(400).send({ message: `appointment not found` });
    }
    appointmentDoc.status = 0;
    await appointmentDoc.save();
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
    const appointmentDoc = await AppointmentModel.findById(req.body._id);
    if (!appointmentDoc) {
      process.log.warning(
        " <- adminController.acceptAppointment: appointment not found"
      );
      return res.status(400).send({ message: `appointment not found` });
    }
    appointmentDoc.status = 2;
    await appointmentDoc.save();
    res.send({ message: `${appointmentDoc.title} is cancelled.` });
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
    const appointmentDoc = await AppointmentModel.findById(req.body._id);
    if (!appointmentDoc) {
      process.log.warning(
        " <- adminController.endAppointment: appointment not found"
      );
      return res.status(400).send({ message: `appointment not found` });
    }
    appointmentDoc.status = 3;
    await appointmentDoc.save();
    res.send({ message: `${appointmentDoc.title} is cancelled.` });
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

    const Model = tools.getModelByRole(+req.user.roleId);

    await Model.findByIdAndUpdate(
      req.user._id,
      req.body,
      (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- adminController.modifyAccountData: Unable to update your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(" <- adminController.modifyAccountData");
        res.send({ message: `${updatedDoc.name} has been updated.` });
      }
    );
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

    const Model = tools.getModelByRole(+req.body.roleId);
    
    await Model.findByIdAndUpdate(
      req.body._id,
      req.body,
      (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- adminController.modifyAccountDataForUser: Unable to update your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(" <- adminController.modifyAccountDataForUser");
        res.send({ message: `${updatedDoc.name} has been updated.` });
      }
    );
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
    await AppointmentModel.findByIdAndUpdate(
      req.user._id,
      { roleId: 2, number: req.body.number, token: null },
      (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- adminController.changeRoleForDentist: Unable to update your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(" <- adminController.changeRoleForDentist");
        res.send({ message: `${updatedDoc.name} has been updated.` });
      }
    );
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
    await AppointmentModel.findByIdAndUpdate(
      req.user._id,
      { roleId: 0, token: "" },
      (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- adminController.changeRoleToAdmin: Unable to update your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(" <- adminController.changeRoleToAdmin");
        res.send({ message: `${updatedDoc.name} has been updated.` });
      }
    );
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
    await AppointmentModel.findByIdAndUpdate(
      req.user._id,
      { roleId: 1, token: "" },
      (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- adminController.changeRoleToClient: Unable to update your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(" <- adminController.changeRoleToClient");
        res.send({ message: `${updatedDoc.name} has been updated.` });
      }
    );
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

const watchHistoryOfDentistAppointments = async (req, res) => {
  process.log.debug(" -> adminController.watchHistoryOfAppointments");

  const appointmentDocs = await AppointmentModel.find({
    DentistId: req.body._id,
  });
  if (!appointmentDocs) {
    process.log.warning(
      " <- adminController.watchHistoryOfAppointments: Unable to retrive the appointments"
    );
    return res
      .status(400)
      .send({ message: `Unable to retrive the appointments` });
  }
  process.log.debug(" <- adminController.watchHistoryOfAppointments");
  res.send(appointmentDocs);
};

const watchHistoryOfClientAppointments = async (req, res) => {
  process.log.debug(" -> adminController.watchHistoryOfAppointments");

  const appointmentDocs = await AppointmentModel.find({
    ClientId: req.body._id,
  });
  if (!appointmentDocs) {
    process.log.warning(
      " <- adminController.watchHistoryOfAppointments: Unable to retrive the appointments"
    );
    return res
      .status(400)
      .send({ message: `Unable to retrive the appointments` });
  }
  process.log.debug(" <- adminController.watchHistoryOfAppointments");
  res.send(appointmentDocs);
};

const watchHistoryOfAppointmentsBetweenDates = async (req, res) => {
  process.log.debug(
    " -> adminController.watchHistoryOfAppointmentsFromPatient"
  );

  const appointmentDocs = await AppointmentModel.find({
    DentistId: req.user._id,
    date: {
      $gt: req.body.start,
      $lt: req.body.end,
    },
  });
  if (!appointmentDocs) {
    process.log.warning(
      " <- adminController.watchHistoryOfAppointmentsBetweenDates: Unable to retrive the appointments"
    );
    return res
      .status(400)
      .send({ message: `Unable to retrive the appointments` });
  }
  process.log.debug(
    " <- adminController.watchHistoryOfAppointmentsBetweenDates"
  );
  res.send(appointmentDocs);
};

const deactivateAcount = async (req, res) => {
  try {
    process.log.debug(" -> adminController.modifyAccountData");
    process.log.data(req.body);
    await userModel.findByIdAndUpdate(
      req.user._id,
      { status: 0, token: "" },
      async (err, updatedDoc) => {
        if (err) {
          process.log.warning(
            " <- adminController.modifyAccountData: Unable to deactivate your profile"
          );
          return res
            .status(400)
            .send({ message: `Unable to update your profile` });
        }
        process.log.debug(
          " <- adminController.modifyAccountData: user status set to 0"
        );
      }
    );
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
    const appointmentDoc = await UserModel.find({token: { $ne: ""}});
    if (!appointmentDoc) {
      process.log.warning(
        " <- adminController.usersLogged: no one is logged"
      );
      return res.status(400).send({ message: `appointment not found` });
    }
    res.send(appointmentDoc);
    process.log.debug(" <- adminController.usersLogged");
  } catch (err) {
    process.log.error(
      ` x- adminController.usersLogged ERROR: ${err.message}`
    );
    res.status(500).send({
      message: "Error on adminController.usersLogged",
      trace: err.message,
    });
  }
}

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

  usersLogged
};
