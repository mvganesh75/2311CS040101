const { generateSchedule } = require("../services/scheduler.service");

async function getSchedule(req, res, next) {
    try {
        const schedule = await generateSchedule();
        return res.json(schedule);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getSchedule,
};
