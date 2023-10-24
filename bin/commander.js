const { program } = require("commander");

program.option("--template <templateName>");
program.parse(process.argv);

module.exports = {
  args: program.args,
  options: program.opts()
};
