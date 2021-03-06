const router = require("express").Router();
const {
  createAppointment,
  cancelAppointment,
  modifyAccountData,
  deactivateAcount,
  watchHistoryOfAppointments,
  watchHistoryOfAppointmentsBetweenDates,
} = require("../controllers/clientController");
const auth = require("../middleware/auth");

router.post("/appointment", auth.loggedRequired, createAppointment);
router.delete("/appointment/:_id", auth.loggedRequired, cancelAppointment);
router.put("/account", auth.loggedRequired, modifyAccountData);
router.delete("/account", auth.loggedRequired, deactivateAcount);
router.get("/appointments", auth.loggedRequired, watchHistoryOfAppointments);
router.post("/appointmentsbetweenDates", auth.loggedRequired, watchHistoryOfAppointmentsBetweenDates);

module.exports = router;
