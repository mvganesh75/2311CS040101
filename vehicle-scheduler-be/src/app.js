const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { requestLogger, errorLogger } = require("../../logging-middleware");

const schedulerRoutes = require("./routes/scheduler.routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(requestLogger);

app.use("/api", schedulerRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Vehicle Scheduler API Running"
    });
});

app.use(errorLogger);

module.exports = app;