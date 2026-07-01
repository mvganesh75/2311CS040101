require("dotenv").config();

const { getDepots } = require("./src/services/depot.service");
const { getVehicles } = require("./src/services/vehicle.service");

(async () => {
    try {
        const depots = await getDepots();
        console.log("Depots:");
        console.log(depots);

        const vehicles = await getVehicles();
        console.log("Vehicles:");
        console.log(vehicles);
    } catch (err) {
        console.error(err.response?.data || err.message);
    }
})();