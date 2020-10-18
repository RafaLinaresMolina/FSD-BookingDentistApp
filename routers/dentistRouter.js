const router = require("express").Router();
const {
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
} = require("../controllers/dentistController");
const auth = require("../middleware/auth");

router.post("/appointment", auth.loggedRequired, auth.dentistRequired, createAppointment);
router.put("/appointment", auth.loggedRequired, auth.dentistRequired, createAppointment);
router.put("/appointment/cancel", auth.loggedRequired, auth.dentistRequired, cancelAppointment);
router.put("/appointment/confirm", auth.loggedRequired, auth.dentistRequired, acceptAppointment);
router.put("/appointment/done", auth.loggedRequired, auth.dentistRequired, endAppointment);
router.delete("/appointment", auth.loggedRequired, auth.dentistRequired, modifyAppointment);

router.put("/account", auth.loggedRequired, auth.dentistRequired, modifyAccountData);
router.delete("/account", auth.loggedRequired, auth.dentistRequired, deactivateAcount);

router.get("/appointments", auth.loggedRequired, auth.dentistRequired, watchHistoryOfAppointments);
router.get("/appointments/user", auth.loggedRequired, auth.dentistRequired, watchHistoryOfAppointmentsFromPatient);
router.get("/appointmentsbetweenDates", auth.loggedRequired, auth.dentistRequired, watchHistoryOfAppointmentsBetweenDates);

module.exports = router;
