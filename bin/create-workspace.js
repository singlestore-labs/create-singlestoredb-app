const axios = require("axios");

const BASE_URL = "https://shell.singlestore.com/api";


async function create() {
    try {
        const response = await axios({
            method: "POST",
            url: "/session",
            baseURL: BASE_URL,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    create,
};
