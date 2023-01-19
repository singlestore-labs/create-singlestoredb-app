#! /usr/bin/env node

var createWorkspace = require("./create-workspace");

if (process.argv.length < 3) {
    console.error("Please enter the name of your new app");
    process.exit(1); //an error occurred
}
if (process.argv.length < 4) {
    console.error("Please enter your key. More info at docs-urls-to-be-added");
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
`);

(async () => {
    const { endpoint, password } = await createWorkspace.create(appName, key);
    console.log({ endpoint, password });
})();
