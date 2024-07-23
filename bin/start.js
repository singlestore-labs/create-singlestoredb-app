#! /usr/bin/env node

const axios = require("axios");
var createWorkspace = require("./create-workspace");
const { execSync } = require("child_process");
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const { options } = require("./commander");
const { isValidTemplateName, handleTemplate } = require("./templates");
const prompts = require("prompts");


// if (options.template) {
//   if (!isValidTemplateName(options.template)) {
//     console.error("Invalid template name");
//     process.exit(1);
//   }

//   introMessage(`Creating a SingleStore application with ${options.template} template`);
//   return handleTemplate(options.template);
// }

function runEstoreApp({ appName, endpoint, user, password, databaseName, port }) {
  try {
    execSync(`git clone https://github.com/singlestore-labs/estore.git ${appName}`);
  } catch (error) {
    console.error(error);
  }

  try {
    execSync(`echo "
      DB_HOST=\"${endpoint}\"
      DB_USER=\"${user}\"
      DB_PASSWORD=\"${password}\"
      DB_NAME=\"${databaseName}\"
      DB_PORT=\"3333"
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


  introMessage(`starting *${appName}*: an awesome app powered by SingleStore!`);

  const { endpoint, user, password, databaseName, port } = await createWorkspace.create();
  console.log("connecting to:", endpoint, user, password, databaseName, port);

  if (flow === "demo" && demo === "store") {
    runEstoreApp({ appName, endpoint, user, password, databaseName, port });
  }

}

startMainThread();

function introMessage(message = "") {
  console.log(`                                                
                                            .5.     7~   ..                                         
                                     ~#:    .@?     @7   .^#7                                       
                               ..    .@&     &G    ^@.    ?&.  J#J:                                 
                               #@7    ^@G    B&    5#    ~@.    Y@G                                 
                                G@G    J@?   J@.   &?   :@^    ^G!  .YG:                            
                         !&P.    7@&^   B@:  ^@^  :@.  .&7    5P.   #@@@~                           
                         .J&@B^   .#@J   @&  .@J  J&   &Y   ~B!     J&?                             
                            ~#@&7   Y@#. ^@B  &#  &5  BG   PP.   .?Y^  .!P&B.                       
                     ?@&Y^    :G@@Y. ^@@7 ?@~ ?Y  Y. 7#  !B~   ~Y7.   ?@@@@&7                       
                     .~P&@@#J:  .Y@@G:.5Y               :5  .?J^     :?BJ:                          
                         .!G&@@B7..7P^.                    !?.  .:~!~:   .^7JPY                     
                   G#P?~:.   .!G@&^ .                        .!!^.    .&@@@@@@&.                    
                   YG#&@@@@&B57:..                           .    ..::~PJ!^..                       
                        .^7YG&B.   .                          .^::..  :::::::...                    
                  ^!!~~^^^::^......                                  7@@@@@@@@@@:                   
                  G@@@@@@@@@#                                     ...::.::::^^^~                    
                   ........:. ..::^:                           .   J@#GY7^.                         
                     .:~7JGY::..    .                            :.~75B&@@@@&#B~                    
                   P@@@@@@@?    .^!!^                         ..5@&5~    .:!JP#^                    
                   :PJ!^.   :~!!^.   !J.                    .YG^.:Y#@@&5^                           
                        :7BB:.    :?J^  7Y               ~B7 7&@#~   ~5&@@#Y^                       
                     .B@@@@&    !Y7.  .GY  7#  Y^ ^B. #&  B@P  ^B@@J    .!P&#                       
                      !&G7:  .?J^    7B^  ^@: .@^ ^@~ :@B  7@&^  .5@@P:                             
                           ~B#.    .GY   .@~  7@   @Y  ?@J  .&@J    ?&@B~                           
                          B@@@!   ?B:    &?   BG   &#   G@^   Y@#.    ~#P                           
                           7P^  .GJ     #5    @~   P@    &@.   ^@@!                                 
                               ~@&:    GB    ~@    !@:   :@B     B@7                                
                                ~PB.  Y#     P#    :@!    ?@Y     .                                 
                                     .BJ:.   @?     @P     5P                                       
                                        ..   J.     7!                                                                                                         
                                                                                                      
${message}
    `);
}
