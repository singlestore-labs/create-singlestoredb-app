const axios = require("axios");
const { response } = require("express");

const API_KEY =
    "ad2eab5f1df1e937cdd5dcba3c730991d1559b971d3035f4627d8ba39c3c3b1f";

const BASE_URL = "https://api.singlestore.com";

async function create(key) {
    console.log("create workspace with key:", key);

    // create workspace group with random password
    // get workspace group ID from the response
    // create workspace with the Workspace group ID
    // get workspace ID
    // get hostname
    // populate connection with hostname and password

    const organization = await getCurrentOrganization(key);
    console.log({ organization });

    const workspaceGroups = await getWorkspaceGroups(key);
    console.log({ workspaceGroups });
}

async function getCurrentOrganization(key) {
    try {
        const response = await axios({
            method: "GET",
            url: "/v1/organizations/current",
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${key}` },
        });

        return response.data;
    } catch (error) {
        console.error(JSON.stringify(error));
    }
}

async function getWorkspaceGroups(key) {
    try {
        const response = await axios({
            method: "GET",
            url: "/v1/workspaceGroups",
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${key}` },
        });

        return response.data;
    } catch (error) {
        console.error(JSON.stringify(error));
    }
}

module.exports = {
    create,
};
