const mongoose = require("mongoose");

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
    enum: ["pending", "confirmed", "done", "cancelled"],
    default: "pending",
  },
  ClientId: {
    type: String,
    required: true,
  },
  DentistId: {
    type: String,
    required: false,
  },
});

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema, "Appointments");

module.exports = AppointmentModel;
