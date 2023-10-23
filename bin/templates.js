const prompts = require("prompts");
const { execSync } = require("child_process");

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
      branch: "main"
    },
    kai: {
      repository: "https://github.com/singlestore-labs/elegance-sdk-template-express.git",
      branch: "kai_template"
    }
  }
};

function isValidTemplateName(name) {
  return Object.keys(templateConfigs).includes(name);
}

async function handleTemplate(templateName) {
  try {
    const { appName } = await prompts(
      {
        type: "text",
        name: "appName",
        message: "What is your project named?",
        initial: "my-app"
      },
      { onCancel: () => process.exit(1) }
    );

    const { connectionType } = await prompts(
      {
        type: "select",
        name: "connectionType",
        message: "What connection type would like to use?",
        choices: [
          { title: "MySQL", value: "mysql" },
          { title: "Kai", value: "kai" }
        ],
        initial: 0
      },
      { onCancel: () => process.exit(1) }
    );

    const templateConfig = templateConfigs[templateName][connectionType];

    execSync(`git clone -b ${templateConfig.branch} ${templateConfig.repository} ${appName}`);
    const _exec = cmd => execSync(cmd, { cwd: `./${appName}`, stdio: "inherit" });
    _exec(`cp .env.sample .env`);
    _exec(`rm -rf .git`);
    _exec(`npm i`);
    console.log("Your app is now ready!");
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  handleTemplate,
  isValidTemplateName
};
