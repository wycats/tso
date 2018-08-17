#!/usr/bin/env node

const shell = require("shelljs");

exec(
  `yarn tsc build/index.ts --noEmit --target es2015 --moduleResolution node --module commonjs --esModuleInterop`
);

function exec(command) {
  const result = shell.exec(command);

  // if (result.code !== 0) {
  //   process.exit(result.code);
  // }
}
