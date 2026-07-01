const express = require("express");
const { getSchedule } = require("../controllers/scheduler.controller");

const router = express.Router();

router.get("/schedule", getSchedule);

module.exports = router;