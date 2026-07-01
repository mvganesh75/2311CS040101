const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[REQUEST] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
    });
    next();
};

const errorLogger = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} - Message: ${err.message}`);
    if (err.stack) {
        console.error(err.stack);
    }
    if (!res.headersSent) {
        res.status(err.status || 500).json({
            error: err.message || "Internal Server Error",
        });
    } else {
        next(err);
    }
};

module.exports = {
    requestLogger,
    errorLogger,
};
