const { getDepots } = require("./depot.service");
const { getVehicles } = require("./vehicle.service");
const { solveKnapsack } = require("../utils/knapsack");

async function generateSchedule() {
    const depotsResponse = await getDepots();
    const vehiclesResponse = await getVehicles();

    const depots = depotsResponse.depots || [];
    const vehicles = vehiclesResponse.vehicles || [];

    // Sort depots by ID to ensure deterministic processing
    const sortedDepots = [...depots].sort((a, b) => a.ID - b.ID);

    const depotSchedules = [];
    let overallTasksScheduled = 0;
    let overallDuration = 0;
    let overallImpact = 0;
    let overallMechanicHours = 0;

    for (const depot of sortedDepots) {
        const capacity = depot.MechanicHours;
        overallMechanicHours += capacity;

        const result = solveKnapsack(vehicles, capacity);

        depotSchedules.push({
            depotId: depot.ID,
            mechanicHours: capacity,
            tasks: result.selectedItems,
            totalDuration: result.totalDuration,
            totalImpact: result.totalImpact,
        });

        overallTasksScheduled += result.selectedItems.length;
        overallDuration += result.totalDuration;
        overallImpact += result.totalImpact;
    }

    return {
        depots: depotSchedules,
        summary: {
            totalDepots: sortedDepots.length,
            totalMechanicHours: overallMechanicHours,
            totalTasksScheduled: overallTasksScheduled,
            totalDuration: overallDuration,
            totalImpact: overallImpact,
        },
    };
}

module.exports = {
    generateSchedule,
};
