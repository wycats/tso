#!/usr/bin/env node

const shell = require("shelljs");

let only = process.env["ONLY"];

if (!only || only === "build") {
  exec(
    `tsc build/index.ts --target es2015 --moduleResolution node --module commonjs --esModuleInterop`
  );
}

if (!only || only === "plugin") {
  exec(
    `tsc plugin/index.ts --target es2015 --moduleResolution node --module commonjs --esModuleInterop`
  );
}

if (process.env["CHROME"]) {
  exec("node --inspect --inspect-brk index.js");
} else {
  exec("node index.js");
}

function exec(command) {
  const result = shell.exec(command);

  // if (result.code !== 0) {
  //   process.exit(result.code);
  // }
}
