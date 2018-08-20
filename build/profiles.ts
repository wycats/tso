import * as ts from "typescript";
import CompilerHost, { Resolve } from "./compiler-host";
import { ArtifactCompilation } from "./compilation/artifact";
import { SimpleCompileDelegate } from "./compilation/delegate";
import { AbsolutePath, AbsoluteDirectory } from "./fs";

export enum ProfileKind {
  Package,
  Project,
  Example,
  Test
}

export type StrictVersion = "2.8" | "2.9" | "3.0";

export interface ProjectReactOptions {
  jsx: ts.JsxEmit | JsxFactory;
}

export interface PackageReactOptions {
  jsx: JsxUsage;
}

export enum JsxUsage {
  Allowed,
  Disallowed
}

export type JsxFactory = string;

export interface Profile {}

export interface ArtifactOptions {
  readonly entry: AbsolutePath[];
  readonly packages: Resolve;
  readonly kind: ProfileKind;
  readonly lastProgram?: ts.Program;
}

export interface ProjectArtifactOptions extends ArtifactOptions {
  readonly kind: ProfileKind.Package | ProfileKind.Project;
  readonly dist: AbsoluteDirectory;
  readonly types: AbsoluteDirectory;
}

export interface TestArtifactOptions extends ArtifactOptions {
  readonly kind: ProfileKind.Test;
  readonly target: AbsoluteDirectory;
}

export function isProjectArtifact(
  options: ArtifactOptions
): options is ProjectArtifactOptions {
  return (
    options.kind === ProfileKind.Package || options.kind === ProfileKind.Project
  );
}

export function isTestArtifact(
  options: ArtifactOptions
): options is TestArtifactOptions {
  return options.kind === ProfileKind.Test;
}

/**
 * An Artifact is a description of a compilation that
 * corresponds to a combination of low-level CompileOptions
 * for the compilation of an entire target artifact.
 *
 * Projects have more configurations available to them,
 * while package profiles are limited to options that can
 * be combined freely.
 */
export class Artifact {
  readonly target: ts.ScriptTarget;
  readonly strict: StrictVersion;
  readonly react: ProjectReactOptions;
  private typescript: ts.CompilerOptions;

  constructor(readonly options: ProjectArtifactOptions | TestArtifactOptions) {
    this.target = ts.ScriptTarget.ES2018;
    this.strict = "3.0";
    this.react = { jsx: ts.JsxEmit.None };

    let typescript: ts.CompilerOptions = {
      target: this.target,
      module: ts.ModuleKind.ES2015,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      skipLibCheck: true,
      traceResolution: true
    };

    if (isProjectArtifact(options)) {
      typescript = {
        ...typescript,
        declaration: true,
        declarationMap: true,
        declarationDir: options.types.path,
        outDir: options.dist.path
      };
    } else {
      typescript = {
        ...typescript,
        outDir: options.target.path
      };
    }

    this.typescript = typescript;
  }

  compile(): ts.Program {
    let host = new CompilerHost(AbsoluteDirectory.cwd(), {
      resolve: this.options.packages,
      typescript: this.typescript
    });

    let program = ts.createProgram({
      rootNames: this.options.entry.map(e => e.path),
      host,
      options: this.typescript,
      oldProgram: this.options.lastProgram
    });

    let compilation = new ArtifactCompilation(program, {
      typescript: this.typescript,
      artifact: {
        delegate: new SimpleCompileDelegate(),
        performance: true
      }
    });

    compilation.compile();

    return program;
  }
}

/**
 * A Package is a description of a compilation that
 * corresponds to a combination of low-level CompileOptions
 * for the compilation of a specific package.
 *
 * Packages always emit declaration files. Packages also
 * always emit ES2015 modules, and if they declare any
 * library features, those features must be present in
 * projects that include them.
 */
export interface Package {
  target: ts.ScriptTarget;
  jsx: JsxUsage;
}
