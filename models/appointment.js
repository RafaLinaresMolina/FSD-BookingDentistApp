const mongoose = require("mongoose");
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
