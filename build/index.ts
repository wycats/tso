import * as ts from "typescript";
import * as path from "path";
import CompilerHost from "./compiler-host";

global.PROFILE = true;

export function compile(fileNames: string[], options: ts.CompilerOptions): void {
  let host = new CompilerHost();

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

  ts.performance.forEachMeasure((name, duration) => {
    console.log(name, duration)
  });

  let exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);
  process.exit(exitCode);
}


// compile(process.argv.slice(2), {
//   noEmitOnError: true,
//   noImplicitAny: true,
//   target: ts.ScriptTarget.ES5,
//   module: ts.ModuleKind.CommonJS
// });
