/// <reference path="./ts.d.ts">

export { Project, AbsoluteFile, AbsoluteDirectory } from "./project";
import * as ts from "typescript";
import CompilerHost from "./compiler-host";

export function compile(
  fileNames: string[],
  options: ts.CompilerOptions
): void {
  let host = new CompilerHost();

  (ts as any).performance.enable();

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
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start!
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
      );
    }
  });

  console.log("\n");
  (ts as any).performance.forEachMeasure((name, duration) => {
    console.log(name, duration);
  });
}
