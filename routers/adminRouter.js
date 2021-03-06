const router = require("express").Router();
const {
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
  
  watchHistoryOfAppointments,
  watchHistoryOfDentistAppointments,
  watchHistoryOfClientAppointments,
  watchHistoryOfAppointmentsBetweenDates,

  usersLogged,
  kickUser
} = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.post("/appointment", auth.loggedRequired, auth.adminRequired, createAppointment);
router.delete("/appointment", auth.loggedRequired, auth.adminRequired, cancelAppointment);
router.put("/appointment", auth.loggedRequired, auth.adminRequired, modifyAppointment);
router.put("/appointment/confirm", auth.loggedRequired, auth.adminRequired, acceptAppointment);
router.put("/appointment/done", auth.loggedRequired, auth.adminRequired, endAppointment);

router.put("/account", auth.loggedRequired, auth.adminRequired, modifyAccountData);
router.put("/account/user", auth.loggedRequired, auth.adminRequired, modifyAccountDataForUser);
router.delete("/account", auth.loggedRequired, auth.adminRequired, deactivateAcount);

router.put("/roles/client", auth.loggedRequired, auth.adminRequired, changeRoleToClient);
router.put("/roles/dentist", auth.loggedRequired, auth.adminRequired, changeRoleToDentist);
router.put("/roles/admin", auth.loggedRequired, auth.adminRequired, changeRoleToAdmin);

router.get("/appointments", auth.loggedRequired, auth.adminRequired, watchHistoryOfAppointments);
router.post("/appointments/dentist", auth.loggedRequired, auth.adminRequired, watchHistoryOfDentistAppointments);
router.post("/appointments/client", auth.loggedRequired, auth.adminRequired, watchHistoryOfClientAppointments);
router.post("/appointmentsbetweenDates", auth.loggedRequired, auth.adminRequired, watchHistoryOfAppointmentsBetweenDates);

router.get("/users/logged", auth.loggedRequired, auth.adminRequired, usersLogged);
router.post("/users/kickuser", auth.loggedRequired, auth.adminRequired, kickUser);



module.exports = router;
