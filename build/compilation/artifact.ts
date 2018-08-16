import * as ts from "typescript";
import { CompileDelegate, StatsKind } from "./delegate";

export interface ArtifactOptions {
  delegate: CompileDelegate;
  performance: boolean;
}

export interface ArtifactConfig {
  typescript: ts.CompilerOptions;
  artifact: ArtifactOptions;
}

interface TsPerformance {
  /**
   * Iterate over each measure, performing some action
   *
   * @param cb The action to perform for each measure
   */
  forEachMeasure(cb: (measureName: string, duration: number) => void): void;

  /** Enables (and resets) performance measurements for the compiler. */
  enable(): void;

  /** Disables performance measurements for the compiler. */
  disable(): void;
}

export class ArtifactCompilation {
  constructor(readonly program: ts.Program, readonly config: ArtifactConfig) {}

  compile() {
    if (this.shouldCollectStats) {
      this.performance.enable();
    }

    let { program } = this;
    let result = program.emit();
    let diagnostics = this.diagnostics(result);
    this.print(diagnostics);

    if (this.shouldCollectStats) {
      this.delegate.log("\n");

      this.performance.forEachMeasure((name, duration) => {
        this.delegate.stats(name, StatsKind.Time, duration);
      });
    }
  }

  private get shouldCollectStats(): boolean {
    return this.config.artifact.performance;
  }

  private get delegate(): CompileDelegate {
    return this.config.artifact.delegate;
  }

  private get performance(): TsPerformance {
    return (ts as any).performance;
  }

  private diagnostics(result: ts.EmitResult): ts.Diagnostic[] {
    return [...ts.getPreEmitDiagnostics(this.program), ...result.diagnostics];
  }

  private print(diagnostics: ts.Diagnostic[]) {
    for (let diagnostic of diagnostics) {
      if (diagnostic.file) {
        this.delegate.log(toString(diagnostic));
      }
    }
  }
}

function location(diagnostic: ts.Diagnostic): ts.LineAndCharacter {
  return diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
}

function body(diagnostic: ts.Diagnostic): string {
  return ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
}

function toString(diagnostic: ts.Diagnostic): string {
  if (diagnostic.file) {
    let { line, character } = location(diagnostic);
    let message = body(diagnostic);

    return `${diagnostic.file.fileName} (${line + 1},${character +
      1}): ${message}`;
  } else {
    return body(diagnostic);
  }
}
