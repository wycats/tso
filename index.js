const ts = require("typescript");
const { Project, AbsoluteFile } = require("./build/index");
const path = require("path");

function relative(...parts) {
  return path.resolve(process.cwd(), ...parts);
}

let project = new Project({
  manifest: new AbsoluteFile(relative("package.json")),
  src: new AbsoluteFile(relative("src", "index.ts")),
  test: [
    new AbsoluteFile(relative("test", "core-test.ts")),
    new AbsoluteFile(relative("test", "validator-test.ts"))
  ]
});

project.compile();

// compile([path.resolve("src/index.ts")], {
//   declaration: true,
//   declarationMap: true,
//   target: ts.ScriptTarget.ES2017,
//   module: ts.ModuleKind.ES2015,
//   moduleResolution: ts.ModuleResolutionKind.NodeJs,
//   extendedDiagnostics: true,
//   traceResolution: true,
//   sourceMap: true
// });

// compile(
//   [path.resolve("test/core-test.ts"), path.resolve("test/validator-test.ts")],
//   {
//     target: ts.ScriptTarget.ES2017,
//     module: ts.ModuleKind.ES2015,
//     moduleResolution: ts.ModuleResolutionKind.NodeJs,
//     extendedDiagnostics: true,
//     traceResolution: true,
//     sourceMap: true
//   }
// );
