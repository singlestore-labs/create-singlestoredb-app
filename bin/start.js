#! /usr/bin/env node

const axios = require("axios");
var createWorkspace = require("./create-workspace")
const { exec, execSync } = require('child_process');

if (process.argv.length < 3) {
  console.error("Please enter the name of your new app");
  process.exit(1); //an error occurred
}
if (process.argv.length < 4) {
  console.error("Please enter your key. More info on https://docs.singlestore.com/managed-service/en/reference/management-api.html#authorization");
  process.exit(1); //an error occurred
}

const appName = process.argv.slice(2, 3)[0];
const key = process.argv.slice(3, 4)[0];

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

starting *${appName}*: an awesome SingleStore app!
`)

// const {hostname, password} = await createWorkspace.create(key).then((resp)=>{
//   console.log("resp")
// });

async function setupConnection(hostname,
  password) {
    console.log(hostname, password)
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


const start = async function (a, b) {
  console.log("...........")
  const hostname = "hostname";
  const password = "secure_pass";
  const response = await setupConnection(hostname, password);

  console.log(response);
}

// execSync(`git clone https://github.com/singlestore-labs/singlestore-app-boilerplate.git ${appName}`)
// execSync(`npm install`,{
//   cwd: './test',
//   stdio: 'inherit'
// })
start();
// exec(`npm run dev`,{
//   cwd: './test',
//   stdio: 'inherit'
// })
// // wait for hostname and password
// axios.(`localhost:3000/setup? hostname password`,{
//   cwd: './test',
//   stdio: 'inherit'
// })


(async () => {
    const { endpoint, password } = await createWorkspace.create(appName, key);
    console.log({ endpoint, password });
})();
