const api = require("../config/axios");

async function getDepots() {
    try {
        const response = await api.get("/evaluation-service/depots");
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching depots:",
            error.response?.data || error.message
        );
        throw error;
    }
}

module.exports = {
    getDepots,
};