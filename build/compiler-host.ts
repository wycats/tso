import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { isRelative } from "./utils";

const pathCompleteExtname = require("path-complete-extname");

const CONFIG = {
  useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames
};

export default class CompilerHost implements ts.CompilerHost {
  constructor(private cwd = process.cwd()) {}

  getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile {
    return tracing(
      "getSourceFile",
      [fileName, languageVersion, desc("onError"), shouldCreateNewSourceFile],
      () =>
        ts.createSourceFile(
          fileName,
          fs.readFileSync(fileName, { encoding: "utf8" }),
          languageVersion,
          false,
          ts.ScriptKind.TS
        ),
      "SourceFile"
    );
  }

  getSourceFileByPath?(
    fileName: string,
    path: ts.Path,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile {
    return tracing("getSourceFileByPath", arguments, () => {
      throw new Error("getSourceFileByPath not implemented.");
    });
  }

  getCancellationToken?(): ts.CancellationToken {
    throw unimpl("getCancellationToken", arguments);
  }

  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return tracing(
      "getDefaultLibFileName",
      arguments,
      () =>
        path.resolve(
          this.cwd,
          "node_modules",
          "typescript",
          "lib",
          "lib.es2015.d.ts"
        ),
      "Path"
    );
  }

  getDefaultLibLocation?(): string {
    return tracing("getDefaultLibLocation", arguments, () =>
      path.resolve(this.cwd, "node_modules", "typescript", "lib")
    );
  }

  writeFile(
    fileName: string,
    data: string,
    writeByteOrderMark: boolean,
    onError: ((message: string) => void) | undefined,
    sourceFiles?: ReadonlyArray<ts.SourceFile>
  ): void {
    tracing("writeFile", [fileName], () => fs.writeFileSync(fileName, data));
  }

  getCurrentDirectory(): string {
    return this.cwd;
  }

  getDirectories(path: string): string[] {
    throw unimpl("getDirectories", arguments);
  }

  getCanonicalFileName(fileName: string): string {
    return CONFIG.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
  }

  useCaseSensitiveFileNames(): boolean {
    return CONFIG.useCaseSensitiveFileNames;
  }

  getNewLine(): string {
    return "\n";
  }

  readDirectory?(
    rootDir: string,
    extensions: ReadonlyArray<string>,
    excludes: ReadonlyArray<string>,
    includes: ReadonlyArray<string>,
    depth?: number
  ): string[] {
    throw unimpl("readDirectory", arguments);
  }

  resolveModuleNames?(
    moduleNames: string[],
    containingFile: string,
    reusedNames?: string[]
  ): ts.ResolvedModule[] {
    return moduleNames.map(name => {
      return tracing("resolveModuleNames", arguments, () => {
        if (isRelative(name)) {
          return {
            resolvedFileName: `${path.resolve(
              path.dirname(containingFile),
              name
            )}${pathCompleteExtname(containingFile)}`,
            isExternalModule: false
          };
        } else {
          let pkgDir = path.resolve(process.cwd(), "node_modules", name);
          let pkg = require(path.join(pkgDir, "package.json"));
          if (pkg.types) {
            return {
              resolvedFileName: path.join(pkgDir, pkg.types),
              isExternalModule: true
            };
          } else {
            console.log(
              `${name} from node_modules not yet implemented without types entry`
            );
            throw unimpl("resolveModuleNames", arguments);
          }
        }
      });
    });
  }

  resolveTypeReferenceDirectives?(
    typeReferenceDirectiveNames: string[],
    containingFile: string
  ): ts.ResolvedTypeReferenceDirective[] {
    if (typeReferenceDirectiveNames.length === 0) {
      return tracing("resolveTypeReferenceDirectives", arguments, () => []);
    } else {
      throw unimpl("resolveTypeReferenceDirectives", arguments);
    }
  }

  getEnvironmentVariable?(name: string): string {
    throw unimpl("getEnvironmentVariable", arguments);
  }

  createHash?(data: string): string {
    throw unimpl("createHash", arguments);
  }

  getModifiedTime?(fileName: string): Date {
    throw unimpl("getModifiedTime", arguments);
  }

  setModifiedTime?(fileName: string, date: Date): void {
    throw unimpl("setModifiedTime", arguments);
  }

  deleteFile?(fileName: string): void {
    throw unimpl("deleteFile", arguments);
  }

  fileExists(fileName: string): boolean {
    throw unimpl("fileExists", arguments);
  }

  readFile(fileName: string): string {
    throw unimpl("readFile", arguments);
  }

  trace?(s: string): void {
    tracing("trace", arguments, () => null);
  }

  directoryExists?(directoryName: string): boolean {
    if (directoryName.match(/@types/)) {
      return tracing("directoryExists", arguments, () => false);
    } else {
      throw unimpl("directoryExists", arguments);
    }
  }

  realpath?(path: string): string {
    throw unimpl("realpath", arguments);
  }
}

let pad = 0;

function tracing<T>(
  name: string,
  args: IArguments | any[],
  callback: () => T,
  kind?: "SourceFile" | "Path"
): T {
  let out = callback();
  console.group(name);
  if (args.length > 0) {
    console.debug(joinArgs(args));
  }

  if (out !== undefined) {
    console.debug("->", toString(out, kind));
  }
  console.groupEnd();
  return out;
}

function unimpl(name: string, args: IArguments | any[]) {
  throw new Error(`Not implemented ${name}(${joinArgs(args)})`);
}

function joinArgs(args: IArguments | any[]) {
  let out = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === undefined) {
      out.push("undefined");
    } else {
      out.push(toString(args[i]));
    }
  }

  return out.join(", ");
}

function isSourceFile(input: any, kind: string): input is ts.SourceFile {
  return kind === "SourceFile";
}

const DESC = Symbol("Desc");

interface Desc {
  [DESC]: true;
  desc: string;
}

function desc(s: string): Desc {
  return {
    [DESC]: true,
    desc: s
  };
}

function isDesc(value: any): value is Desc {
  return value && typeof value === "object" && DESC in value;
}

function isPath(value: any, kind: string): value is fs.PathLike {
  return kind === "Path";
}

function toString(input: unknown, kind?: "SourceFile" | "Path"): string {
  if (isSourceFile(input, kind)) {
    return `SourceFile { fileName: ${JSON.stringify(input.fileName)} }`;
  } else if (isPath(input, kind)) {
    return `Path { file: ${input} }`;
  }

  if (isDesc(input)) {
    return input.desc;
  }

  try {
    let string = JSON.stringify(input, null, 2);

    if (string !== undefined) {
      return string;
    } else {
      return String(input);
    }
  } catch {
    return String(input);
  }
}
