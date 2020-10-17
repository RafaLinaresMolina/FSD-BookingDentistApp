const mongoose = require("mongoose");
const AppointmentModel = require("../models/appointment");
const bcrypt = require("bcryptjs");
const {isValidDate} = require('../lib/tools');

const createAppointment = async (req, res) => {
  try {
    process.log.debug(" -> clientController.createAppointment");
    process.log.data(req.body);
    const Appointment = mongoose.model("Clients", AppointmentModel.schema, AppointmentModel.collection);
    const appointmentDoc = new Appointment(req.body);
    if(await !isValidDate(appointmentDoc.date)){
      return res.status(400).send({message: 'Date is not valid, either is already taken, is weekend or is out of the schedule.'})
    }
    appointmentDoc.ClientId = req.user._id;
    await appointmentDoc.save();
    res.send(appointmentDoc);
    process.log.debug(" <- clientController.createAppointment");
  } catch (err) {
    process.log.error(` x- clientController.createAppointment ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on clientController.createAppointment", trace: err });
  }
};


const cancelAppointment = async (req, res) => {
  try {
    process.log.debug(" -> clientController.cancelAppointment");
    process.log.data(req.body);
    const appointmentDoc = AppointmentModel.findOne({'_id': req.body._id, ClientId: req.user._id});
    if(!appointment){
      return res.status(400).send({message: `appointment not found`})
    }
    appointmentDoc.status = 0;
    await appointmentDoc.save();
    res.send({message: `${appointmentDoc.title} is cancelled.`});
    process.log.debug(" <- clientController.cancelAppointment");
  } catch (err) {
    process.log.error(` x- clientController.cancelAppointment ERROR: ${err.message}`);
    res
      .status(500)
      .send({ message: "Error on clientController.cancelAppointment", trace: err });
  }
};

module.exports = {
  createAppointment,
  cancelAppointment
};
