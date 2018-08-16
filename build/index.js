"use strict";
/// <reference path="./ts.d.ts">
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const compiler_host_1 = require("./compiler-host");
function compile(fileNames, options) {
    let host = new compiler_host_1.default();
    ts.performance.enable();
    let program = ts.createProgram({
        rootNames: fileNames,
        options,
        host
    });
    let emitResult = program.emit();
    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);
    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
            console.log(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
        }
    });
    console.log("\n");
    ts.performance.forEachMeasure((name, duration) => {
        console.log(name, duration);
    });
}
exports.compile = compile;
