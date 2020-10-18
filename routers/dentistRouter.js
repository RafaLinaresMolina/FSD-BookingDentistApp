const router = require("express").Router();
const {
  createAppointment,
  cancelAppointment,
  modifyAppointment,
  deactivateAcount,
  watchHistoryOfAppointments,
  watchHistoryOfAppointmentsFromPatient,
  watchHistoryOfAppointmentsBetweenDates,
} = require("../controllers/dentistController");
const auth = require("../middleware/auth");

router.post("/appointment", auth.loggedRequired, auth.dentistRequired, createAppointment);
router.delete("/appointment", auth.loggedRequired, auth.dentistRequired, cancelAppointment);
router.delete("/account", auth.loggedRequired, auth.dentistRequired, deactivateAcount);
router.get("/appointments", auth.loggedRequired, auth.dentistRequired, watchHistoryOfAppointments);
router.get("/appointments/user", auth.loggedRequired, auth.dentistRequired, watchHistoryOfAppointmentsFromPatient);
router.get(
  "/appointmentsbetweenDates",
  auth.loggedRequired,
  auth.dentistRequired,
  watchHistoryOfAppointmentsBetweenDates
);

module.exports = router;
