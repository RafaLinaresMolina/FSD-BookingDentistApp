const mongoose = require("mongoose");
const UserModel = require("./user");
const Schema = mongoose.Schema;
const AppointmentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  observations: {
    type: String,
    required: false,
  },
  creationDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: [1, 2, 3, 0],
    default: 1,
  },
  ClientId: { type: Schema.Types.ObjectId, ref: "User" },
  DentistId: { type: Schema.Types.ObjectId, ref: "User" },
});

AppointmentSchema.post("find", async function (docs) {
  for (let doc of docs) {
    await doc.populate("ClientId").execPopulate();
    await doc.populate("DentistId").execPopulate();
  }
  this.populate("ClientId").populate("DentistId");
});

AppointmentSchema.statics.createAppointment = async function (
  appointment,
  ClientId,
  DentistId = null
) {
  try {
    const tools = require("../lib/tools");
    const date = new Date(appointment.date);
    await this.isDateTaken(date);
    tools.isMorningShift(date);
    tools.isNightShift(date);
    tools.isWeekend(date);
    appointment.ClientId = ClientId;
    appointment.DentistId = DentistId;
    return await this.create(appointment);
  } catch (err) {
    throw err;
  }
};

AppointmentSchema.statics.isDateTaken = async function (date) {
  try {
    const appointment = await this.findOne({
      status: { $ne: 0 },
      date: new Date(date).toISOString(),
    });
    if (appointment) {
      throw new Error("The date is already taken.");
    }
  } catch (err) {
    throw err;
  }
};

AppointmentSchema.statics.cancelAppointment = async function (id) {
  try {
    const appointmentDoc = await this.findById(id);
    if (!appointmentDoc) {
      process.log.warning(
        " <- AppointmentSchema.statics.cancelAppointment: appointment not found"
      );
      throw new Error(`appointment not found`);
    }
    appointmentDoc.status = 0;
    await appointmentDoc.save();
    return appointmentDoc;
  } catch (err) {
    throw err;
  }
};

AppointmentSchema.statics.acceptAppointment = async function (id) {
  try {
    const appointmentDoc = await this.findById(id);
    if (!appointmentDoc) {
      process.log.warning(
        " <- AppointmentSchema.statics.acceptAppointment: appointment not found"
      );
      throw new Error(`appointment not found`);
    }
    appointmentDoc.status = 2;
    await appointmentDoc.save();
    return appointmentDoc;
  } catch (err) {
    throw err;
  }
};

AppointmentSchema.statics.modifyAppointment = async function (query, data) {
  try {
    const appointmentDoc = await this.findOneAndUpdate(query, data).exec();
    if (!appointmentDoc) {
      process.log.warning(
        " <- AppointmentSchema.statics.modifyAppointment: appointment not found"
      );
      throw new Error(`appointment not found`);
    }
    appointmentDoc.status = 0;
    await appointmentDoc.save();
    return appointmentDoc;
  } catch (err) {
    throw err;
  }
};

AppointmentSchema.statics.confirmAppointment = async function (id) {
  try {
    const appointmentDoc = await this.findById(id);
    if (!appointmentDoc) {
      process.log.warning(
        " <- AppointmentSchema.statics.confirmAppointment: appointment not found"
      );
      throw new Error(`appointment not found`);
    }
    appointmentDoc.status = 2;
    await appointmentDoc.save();
    return appointmentDoc;
  } catch (err) {
    throw err;
  }
};

AppointmentSchema.statics.endAppointment = async function (id) {
  try {
    const appointmentDoc = await this.findById(id);
    if (!appointmentDoc) {
      process.log.warning(
        " <- AppointmentSchema.statics.endAppointment: appointment not found"
      );
      throw new Error(`appointment not found`);
    }
    appointmentDoc.status = 3;
    await appointmentDoc.save();
    return appointmentDoc;
  } catch (err) {
    throw err;
  }
};

AppointmentSchema.statics.getAllAppointments = async function (query) {
  try {
    const appointmentDocs = await this.find(query);
    if (!appointmentDocs) {
      process.log.warning(
        " <- AppointmentSchema.statics.getAllAppointments: Unable to retrive the appointments"
      );
      return res
        .status(400)
        .send({ message: `Unable to retrive the appointments` });
    }

    return appointmentDocs;
  } catch (err) {
    throw err;
  }
};

AppointmentSchema.statics.cancelAppointmentsOnCascade = async function (
  query,
  set,
  options
) {
  const updatedDocuments = await this.updateMany(query, set, options).exec();
    if (!updatedDocuments) {
      process.log.warning(
        " <- AppointmentSchema.statics.cancelAppointmentsOnCascade: Unable to deactivate your active appointments"
      );
      throw new Error(`Unable to deactivate your active appointments`);
    }
    process.log.debug(
      " <- AppointmentSchema.statics.cancelAppointmentsOnCascade: user active appointments status set to 0"
    );
    return updatedDocuments;
  
};

const AppointmentModel = mongoose.model(
  "Appointment",
  AppointmentSchema,
  "Appointments"
);

module.exports = AppointmentModel;
