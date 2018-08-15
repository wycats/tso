const shell = require("shelljs");

global.PROFILE = true;

exec(`node --inspect --inspect-brk ./node_modules/typescript/bin/tsc build/index.ts --target es2015 --moduleResolution node --module commonjs`);
exec("node index.js");

function exec(command) {
  const result = shell.exec(command);

  // if (result.code !== 0) {
  //   process.exit(result.code);
  // }
}
