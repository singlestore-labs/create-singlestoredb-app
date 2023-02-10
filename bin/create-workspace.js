const axios = require("axios");

const BASE_URL = "https://api.singlestore.com";

const POLL_INTERVAL_SECONDS = 10;

async function create(appName, key) {
    console.log("create workspace with key:", key);

    // const organization = await getCurrentOrganization(key);
    // console.log({ organization });

    const regions = await getRegions(key);
    // console.log({ regions });

    const workspaceGroups = await getWorkspaceGroups(key);
    // console.log({ workspaceGroups });

    let workspaceGroupName = `${appName}-workspace-group`;
    if (workspaceGroups.length === 0) {
        workspaceGroupName += `-1`;
    } else {
        workspaceGroupName += `-${workspaceGroups.length + 1}`;
    }

    // create workspace group with random password
    const workspaceGroup = await createWorkspaceGroup({
        key,
        name: workspaceGroupName,
        regionID: regions[0].regionID,
    });
    // console.log({ workspaceGroup });

    // get workspace group ID from the response
    const { workspaceGroupID, adminPassword } = workspaceGroup;

    // create workspace with the Workspace group ID
    let workspace = await createWorkspace({
        key,
        name: `${appName}-workspace-1`,
        workspaceGroupID,
    });
    // console.log({ workspace });

    // get workspace ID
    const { workspaceID } = workspace;

    const startTime = new Date();

    const workspaceActive = await new Promise((resolve) => {
        const workspacePollInterval = setInterval(async () => {
            const endTime = new Date();
            const elapsedSeconds = Math.round((endTime - startTime) / 1000);
            console.log(
                `Waiting for the workspace to be active... ${elapsedSeconds} seconds`
            );

            workspace = await getWorkspace({ key, workspaceID });
            // console.log({ workspace });

            if (workspace.state === "ACTIVE") {
                clearInterval(workspacePollInterval);
                console.log("Your workspace is active!");
                resolve(workspace);
            }
        }, POLL_INTERVAL_SECONDS * 1000);
    });

    // get hostname

    return {
        endpoint: workspaceActive.endpoint,
        password: adminPassword,
    };
    // populate connection with hostname and password
}

async function getRegions(key) {
    try {
        const response = await axios({
            method: "GET",
            url: "/v1/regions",
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${key}` },
        });

        return response.data;
    } catch (error) {
        throw error
    }
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
        throw error
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
        throw error;
    }
}

async function createWorkspaceGroup({ key, name, regionID }) {
    try {
        const response = await axios({
            method: "POST",
            url: "/v1/workspaceGroups",
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${key}` },
            data: {
                name,
                regionID,
                firewallRanges: ["0.0.0.0/0"],
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getWorkspace({ key, workspaceID }) {
    try {
        const response = await axios({
            method: "GET",
            url: `/v1/workspaces/${workspaceID}`,
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${key}` },
            params: {
                fields: "name,size,state,workspaceGroupID,workspaceID,createdAt,endpoint",
            },
        });

        return response.data;
    } catch (error) {
        throw error
    }
}

async function createWorkspace({ key, name, workspaceGroupID }) {
    try {
        const response = await axios({
            method: "POST",
            url: "/v1/workspaces",
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${key}` },
            data: {
                name,
                workspaceGroupID,
            },
        });

        return response.data;
    } catch (error) {
        throw error
    }
}

module.exports = {
    create,
};
