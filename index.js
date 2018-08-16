const ts = require("typescript");
const { compile } = require("./build/index");
const path = require("path");

compile([path.resolve("src/index.ts")], {
  declaration: true,
  declarationMap: true,
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.ES2015,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  extendedDiagnostics: true,
  traceResolution: true,
  sourceMap: true
});

compile(
  [path.resolve("test/core-test.ts"), path.resolve("test/validator-test.ts")],
  {
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.ES2015,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    extendedDiagnostics: true,
    traceResolution: true,
    sourceMap: true
  }
);
