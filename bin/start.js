#! /usr/bin/env node

const axios = require("axios");
var createWorkspace = require("./create-workspace")
const { execSync } = require('child_process');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

async function setupConnection(hostname, password) {
  try {
    const response = await axios({
      method: "POST",
      url: "/setup",
      baseURL: "http://localhost:3000",
      data: {
        hostname,
        password
      },
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

if (isMainThread) {
  const threads = new Set();;

  if (process.argv.length < 3) {
    console.error("Please enter the name of your new app");
    process.exit(1);
  }

  const appName = process.argv.slice(2, 3)[0];

  if (process.argv.length < 4) {
    console.error("Please enter your key. More info on https://docs.singlestore.com/managed-service/en/reference/management-api.html#authorization");
    process.exit(1);
  }

  const key = process.argv.slice(3, 4)[0];

  threads.add(new Worker(__filename, { workerData: { type: "workspace", appName, key } }));
  threads.add(new Worker(__filename, { workerData: { type: "app", appName, key } }));

  for (let worker of threads) {
    worker.on('error', (err) => { throw err; });
    worker.on('exit', () => {
      threads.delete(worker);
    })
    worker.on('message', (msg) => {
      if (msg.type === "exit") {
        threads.delete(worker);
        process.exit(1)
      }
      console.log(msg);
    });
  }

} else {
  // This code is executed in the worker and not in the main thread.

  if (workerData.type === "app") {
    console.log(`
                           oo 
                 ooOOOOOo     oOo
            ooOOOOOOOOOOOOOOo   oOOOo
         oOOOOOOOOOOOOOo oOOOOo  oOOOOo
       oOOOOOOOOOo            oOo  oOOOOo
      oOOOOOOOOo                 o  oOOOOo
     oOOOOOOOO                       oOOOOOo
    oOOOOOOOO                        oOOOOOo
    oOOOOOOOO                        oOOOOOo 
    oOOOOOOOO                       oOOOOOOo
    oOOOOOOOOO                    oOOOOOOOOo
     oOOOOOOOOOo                 oOOOOOOOOo
      oOOOOOOOOOOo            oOOOOOOOOOOo
       oOOOOOOOOOOOOOOoo oOOOOOOOOOOOOOoo
         oOOOOOOOOOOOOOOOOOOOOOOOOOOOo
            ooOOOOOOOOOOOOOOOOOOOoo
                 ooooOOOOOOoooo
    
    starting *${workerData.appName}*: an awesome app powered by SingleStoreDB!
    `)
    try {
      execSync(`git clone https://github.com/singlestore-labs/singlestore-app-boilerplate.git ${workerData.appName}`)
    } catch (error) {
      console.error(error)
    }
    
    try {
      execSync(`npm install`, {
        cwd: `./${workerData.appName}`,
        stdio: 'inherit'
      })
    } catch (error) {
      console.error(error)
    }

    try {
      execSync(`npm run dev`, {
        cwd: `./${workerData.appName}`,
        stdio: 'inherit'
      })
    } catch (error) {
      console.error(error)
    }

    parentPort.postMessage('Your app is now ready!');
  }
  else if (workerData.type === "workspace") {
    (async () => {
        try {
          console.log("start creating your workspace...")
          const { endpoint, password } = await createWorkspace.create(workerData.appName, workerData.key);
          await setupConnection(endpoint, password);
          parentPort.postMessage('Your workspace is ready!');
        } catch (error) {
          console.error(`Error ${error.response.status}: ${error.response.data}`)
          parentPort.postMessage({type: "exit"})
          process.exit(1)
        }
    })();

  }
}


