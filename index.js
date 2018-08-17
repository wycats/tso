// @ts-check

const ts = require("typescript");
const { Project, AbsoluteFile } = require("./build/index");
const path = require("path");

function relative(...parts) {
  return path.resolve(process.cwd(), ...parts);
}

let project = Project.fromOptions({
  manifest: new AbsoluteFile(relative("package.json")),
  test: "test/**/*-test.ts"
});

project.compile();
