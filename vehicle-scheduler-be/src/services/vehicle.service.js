const api = require("../config/axios");

async function getVehicles() {
    try {
        const response = await api.get("/evaluation-service/vehicles");
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching vehicles:",
            error.response?.data || error.message
        );
        throw error;
    }
}

module.exports = {
    getVehicles,
};