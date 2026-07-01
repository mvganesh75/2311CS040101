const axios = require("axios");
require("dotenv").config();

function decodeTokenPayload(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payloadJson = Buffer.from(parts[1], "base64").toString("utf8");
        return JSON.parse(payloadJson);
    } catch (e) {
        return null;
    }
}

let tokenRefreshPromise = null;

async function refreshBearerToken() {
    const currentToken = process.env.BEARER_TOKEN;
    if (!currentToken) {
        throw new Error("No BEARER_TOKEN found in environment variables");
    }

    const payload = decodeTokenPayload(currentToken);
    if (!payload) {
        throw new Error("Failed to parse BEARER_TOKEN payload");
    }

    const body = {
        companyName: payload.MapClaims?.iss || payload.iss || "Afford Medical Technologies Private Limited",
        clientID: payload.clientID || payload.MapClaims?.sub || payload.sub,
        clientSecret: payload.clientSecret || "xBBttkYJxjpMQyTy",
        name: payload.name || payload.MapClaims?.name,
        email: payload.email || payload.MapClaims?.email,
        rollNo: payload.rollNo || "2311cs040101",
        accessCode: payload.accessCode || "xpQddd",
    };

    // Correct clientSecret lowercase if needed
    if (body.clientSecret === "xBBttkYJxjPMQyTy") {
        body.clientSecret = "xBBttkYJxjpMQyTy";
    }

    const authUrl = `${process.env.BASE_URL}/evaluation-service/auth`;
    const response = await axios.post(authUrl, body, {
        headers: { "Content-Type": "application/json" },
    });

    if (response.data && response.data.access_token) {
        const newToken = response.data.access_token;
        process.env.BEARER_TOKEN = newToken;
        return newToken;
    } else {
        throw new Error("Invalid response format from auth endpoint");
    }
}

const api = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    let token = process.env.BEARER_TOKEN;
    if (token) {
        const payload = decodeTokenPayload(token);
        const exp = payload.MapClaims?.exp || payload.exp;
        const bufferTime = 30; // refresh token if it expires in less than 30 seconds
        const isExpired = exp && (exp - bufferTime) < (Date.now() / 1000);

        if (isExpired) {
            try {
                if (!tokenRefreshPromise) {
                    tokenRefreshPromise = refreshBearerToken().then((t) => {
                        tokenRefreshPromise = null;
                        return t;
                    }).catch((err) => {
                        tokenRefreshPromise = null;
                        throw err;
                    });
                }
                token = await tokenRefreshPromise;
            } catch (error) {
                console.error("Token refresh failed:", error.message);
            }
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

module.exports = api;