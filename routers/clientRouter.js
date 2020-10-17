const router = require('express').Router();
const {createAppointment, cancelAppointment} = require('../controllers/clientController');

router.post("/appointment", createAppointment);
router.delete("/appointment", cancelAppointment);

module.exports = router;