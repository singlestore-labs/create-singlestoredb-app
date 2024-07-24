#! /usr/bin/env node
const axios = require("axios");
var createWorkspace = require("./create-workspace");
const { execSync } = require("child_process");
const prompts = require("prompts");


function execCommand(cmd) {
  try {
    execSync(cmd, {
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }
}

function execCommandInApp(cmd, appName) {
  try {
    execSync(cmd, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }
}

function runEstoreApp({ appName, envFileCommand }) {
  // TODO: remove once MR is approved
  execCommand(`git clone https://github.com/singlestore-labs/estore.git --branch hackathon-summer-2024 --single-branch ${appName}`);
  execCommandInApp(envFileCommand, appName);
  execCommandInApp("npm i", appName);
  execCommandInApp("npm run start:data", appName);
  // execCommandInApp("npm run build",appName);
  execCommandInApp("npm run dev", appName);
  console.log("Your app is now ready!");
}

function createNextApp({ appName, envFileCommand }) {
  // TODO: remove once MR is approved
  execCommand(`npx --yes create-next-app@latest ${appName} --example https://github.com/singlestore-labs/elegance-sdk-template-next/tree/hackathon-summer-2024`);
  execCommandInApp(envFileCommand, appName);
  execCommandInApp("npm run dev", appName);
}

function createRemixApp({ appName, envFileCommand }) {
  execCommand(`npx --yes create-remix@latest ${appName} --template singlestore-labs/elegance-sdk-template-remix`)
  execCommandInApp(envFileCommand, appName);
  execCommandInApp("npm run dev", appName);
}

function createExpressApp({ appName, envFileCommand }) {
  // TODO: remove once MR is approved
  execCommand(`git clone https://github.com/singlestore-labs/elegance-sdk-template-express.git --branch hackathon-summer-2024-2 --single-branch ${appName}`);
  execCommandInApp("rm -rf .git", appName);
  execCommandInApp(envFileCommand, appName);
  execCommandInApp("npm i", appName);
  execCommandInApp("npm run dev", appName);
}

async function startMainThread() {
  const { appName } = await prompts(
    {
      type: "text",
      name: "appName",
      message: "What is your project named?",
      initial: "my-singlestore-app"
    },
    { onCancel: () => process.exit(1) }
  );


  const { flow } = await prompts(
    {
      type: "select",
      name: "flow",
      message: "What would you like to create?",
      choices: [
        { title: "Full built demo!", value: "demo" },
        { title: "Build my own app", value: "app" }
      ],
      initial: 0
    },
    { onCancel: () => process.exit(1) }
  );

  const { demo } = await prompts(
    {
      type: _prev => flow === 'demo' ? 'select' : null,
      name: "demo",
      message: "What demo would you like to try?",
      choices: [
        { title: "Gen AI store", value: "store" }
      ],
      initial: 0
    },
    {
      onCancel: () => process.exit(1),

    }
  );
  const { framework } = await prompts(
    {
      type: _prev => flow === 'app' ? 'select' : null,
      name: "framework",
      message: "What framework would you like to use?",
      choices: [
        { title: "Next.js", value: "next" },
        { title: "Express", value: "express" },
        { title: "Remix", value: "remix" }
      ],
      initial: 0
    },
    {
      onCancel: () => process.exit(1),

    }
  );

  // introMessage(`starting *${appName}*: an awesome app powered by SingleStore!`);

  // const { endpoint, user, password, databaseName } = await createWorkspace.create();
  // console.log("connecting to:", endpoint, user, password, databaseName);
  // const user = "user5yei3l";
  // const endpoint = "svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com"
  // const password = "akdF5FYftk8ZSfXlfEC9UKrWdxNy1ksR"
  // const databaseName = "ufdcs";
  const endpoint = "svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com"
  const user = "userxd1oub"
  const password = 'jlLJFFQh49WDns0AI1ZjNbt7lt6rKts1'
  const databaseName = "yikhd"

  const envFileCommand = `echo "
      DB_HOST=${endpoint}
      DB_USER=${user}
      DB_PASSWORD=${password}
      DB_NAME=${databaseName}
      DB_PORT=3333
      TIER=shared
      " > .env`


  if (flow === "demo" && demo === "store") {
    runEstoreApp({ appName, endpoint, envFileCommand });
  } else if (flow === "app" && framework === "next") {
    createNextApp({ appName, endpoint, envFileCommand });
  } else if (flow === "app" && framework === "express") {
    const expressEnvFileCommand = `echo "
      REACT_APP_DB_HOST=${endpoint}
      REACT_APP_DB_USER=${user}
      REACT_APP_DB_PASSWORD=${password}
      REACT_APP_DB_NAME=${databaseName}
      REACT_APP_DB_PORT=3333
      REACT_APP_TIER=shared
      " > .env`
    createExpressApp({ appName, endpoint, envFileCommand: expressEnvFileCommand });
  } else if (flow === "app" && framework === "remix") {
    createRemixApp({ appName, endpoint, envFileCommand });
  }

}

startMainThread();
