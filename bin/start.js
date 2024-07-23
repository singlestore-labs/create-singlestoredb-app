#! /usr/bin/env node

const axios = require("axios");
var createWorkspace = require("./create-workspace");
const { execSync, spawn } = require("child_process");
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const { options } = require("./commander");
const { isValidTemplateName, handleTemplate } = require("./templates");
const prompts = require("prompts");


const templateConfigs = {
  "elegance-next": {
    mysql: {
      repository: "https://github.com/singlestore-labs/elegance-sdk-template-next.git",
      branch: "main"
    },
    kai: {
      repository: "https://github.com/singlestore-labs/elegance-sdk-template-next.git",
      branch: "kai_template"
    }
  },
  "elegance-express": {
    mysql: {
      repository: "https://github.com/singlestore-labs/elegance-sdk-template-express.git",
      branch: "hackathon-summer-2024"
    },
    kai: {
      repository: "https://github.com/singlestore-labs/elegance-sdk-template-express.git",
      branch: "kai_template"
    }
  }
};

// if (options.template) {
//   if (!isValidTemplateName(options.template)) {
//     console.error("Invalid template name");
//     process.exit(1);
//   }

//   introMessage(`Creating a SingleStore application with ${options.template} template`);
//   return handleTemplate(options.template);
// }

function runEstoreApp({ appName, endpoint, user, password, databaseName }) {
  try {
    console.log("cloning....")
    execSync(`git clone https://github.com/singlestore-labs/estore.git --branch hackathon-summer-2024 --single-branch ${appName}`);
  } catch (error) {
    console.error(error);
  }

  try {
    execSync(`echo "
      DB_HOST=${endpoint}
      DB_USER=${user}
      DB_PASSWORD=${password}
      DB_NAME=${databaseName}
      DB_PORT=3333"
      TIER=shared
      " > .env`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }
  try {
    execSync(`npm install`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }
  try {
    execSync(`npm run start:data`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }
  try {
    execSync(`npm run build`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }

  try {
    execSync(`npm run dev`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }

  console.log("Your app is now ready!");
}

function createNextApp({ appName, endpoint, user, password, databaseName }) {
  try {
    execSync(`npx --yes create-next-app@latest ${appName} --example https://github.com/singlestore-labs/elegance-sdk-template-next/tree/hackathon-summer-2024`, {
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }

  try {
    execSync(`echo "
      DB_HOST=${endpoint}
      DB_USER=${user}
      DB_PASSWORD=${password}
      DB_NAME=${databaseName}
      DB_PORT=3333"
      TIER=shared
      " > .env`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }

  try {
    execSync(`npm run dev`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }
}

function createExpressApp({ appName, endpoint, user, password, databaseName }) {
  try {
    execSync(`git clone ${templateConfigs['elegance-express']["mysql"].repository} --branch ${templateConfigs['elegance-express']["mysql"].branch} --single-branch ${appName}`, {
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }

  try {
    execSync(`echo "
      DB_HOST=${endpoint}
      DB_USER=${user}
      DB_PASSWORD=${password}
      DB_NAME=${databaseName}
      DB_PORT=3333"
      TIER=shared
      " > .env`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }

  try {
    execSync(`npm run dev`, {
      cwd: `./${appName}`,
      stdio: "inherit"
    });
  } catch (error) {
    console.error(error);
  }
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
        { title: "Express", value: "express" }
      ],
      initial: 0
    },
    {
      onCancel: () => process.exit(1),

    }
  );


  // introMessage(`starting *${appName}*: an awesome app powered by SingleStore!`);

  const { endpoint, user, password, databaseName } = await createWorkspace.create();
  console.log("connecting to:", endpoint, user, password, databaseName);
  // const user = "user5yei3l";
  // const endpoint = "svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com"
  // const password = "akdF5FYftk8ZSfXlfEC9UKrWdxNy1ksR"
  // const databaseName = "ufdcs";

  if (flow === "demo" && demo === "store") {
    runEstoreApp({ appName, endpoint, user, password, databaseName });
  } else if (flow === "app" && framework === "next") {
    createNextApp({ appName, endpoint, user, password, databaseName });
  } else if (flow === "app" && framework === "express") {
    createExpressApp({ appName, endpoint, user, password, databaseName });
  }

}

startMainThread();
