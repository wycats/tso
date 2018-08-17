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

  constructor(readonly entry: AbsolutePath[], readonly packages: Resolve) {
    this.target = ts.ScriptTarget.ES2018;
    this.strict = "3.0";
    this.react = { jsx: ts.JsxEmit.None };
  }

  compile() {
    let host = new CompilerHost(AbsoluteDirectory.cwd(), {
      resolve: this.packages
    });

    let options = {
      target: this.target,
      module: ts.ModuleKind.ES2015
    };

    let program = ts.createProgram({
      rootNames: this.entry.map(e => e.path),
      host,
      options: {
        target: this.target,
        module: ts.ModuleKind.ES2015
      }
    });

    let compilation = new ArtifactCompilation(program, {
      typescript: options,
      artifact: {
        delegate: new SimpleCompileDelegate(),
        performance: true
      }
    });

    compilation.compile();
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
