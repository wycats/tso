import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { isRelative } from "./utils";

const pathCompleteExtname = require("path-complete-extname");
const mkdirp = require("mkdirp");

const CONFIG = {
  useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames
};

export default class CompilerHost implements ts.CompilerHost {
  constructor(private cwd = process.cwd()) {}

  getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): ts.SourceFile {
    trace("getSourceFile", [fileName, languageVersion, function onError() { /* ... */ }, shouldCreateNewSourceFile]);
    return ts.createSourceFile(fileName, fs.readFileSync(fileName, { encoding: "utf8"}), languageVersion, false, ts.ScriptKind.TS);
  }
  getSourceFileByPath?(fileName: string, path: ts.Path, languageVersion: ts.ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): ts.SourceFile {
    trace("getSourceFileByPath", arguments);
    throw new Error("getSourceFileByPath not implemented.");
  }
  getCancellationToken?(): ts.CancellationToken {
    throw unimpl("getCancellationToken", arguments);
  }
  getDefaultLibFileName(options: ts.CompilerOptions): string {
    trace("getDefaultLibFileName", arguments);
    return path.resolve(this.cwd, "node_modules", "typescript", "lib", "lib.es2015.d.ts");
  }
  getDefaultLibLocation?(): string {
    trace("getDefaultLibLocation", arguments);
    return path.resolve(this.cwd, "node_modules", "typescript", "lib");
  }
  writeFile(fileName: string, data: string, writeByteOrderMark: boolean, onError: ((message: string) => void) | undefined, sourceFiles?: ReadonlyArray<ts.SourceFile>): void {
    fs.writeFileSync(fileName, data);
    trace("writeFile", [fileName]);
  }
  getCurrentDirectory(): string {
    // trace("getCurrentDirectory", arguments);
    return this.cwd;
  }
  getDirectories(path: string): string[] {
    throw unimpl("getDirectories", arguments);
  }
  getCanonicalFileName(fileName: string): string {
    // trace("getCanonicalFileName", arguments);
    return CONFIG.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
  }
  useCaseSensitiveFileNames(): boolean {
    // trace("useCaseSensitiveFileNames", arguments)
    return CONFIG.useCaseSensitiveFileNames;
  }
  getNewLine(): string {
    // trace("getNewLine", arguments);
    return "\n";
  }
  readDirectory?(rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string>, includes: ReadonlyArray<string>, depth?: number): string[] {
    throw unimpl("readDirectory", arguments);
  }
  resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames?: string[]): ts.ResolvedModule[] {
    return moduleNames.map(name => {
      trace("resolveModuleNames", arguments);
      if (isRelative(name)) {
        return {
          resolvedFileName: `${path.resolve(path.dirname(containingFile), name)}${pathCompleteExtname(containingFile)}`,
          isExternalModule: false
        };  
      } else {
        let pkgDir = path.resolve(process.cwd(), "node_modules", name);
        let pkg = require(path.join(pkgDir, "package.json"));
        if (pkg.types) {
          trace("resolveModuleNames", arguments);
          return {
            resolvedFileName: path.join(pkgDir, pkg.types),
            isExternalModule: true
          }
        } else {
          console.log(`${name} from node_modules not yet implemented without types entry`);
          throw unimpl("resolveModuleNames", arguments);
        }

      }
    });
  }

  resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[], containingFile: string): ts.ResolvedTypeReferenceDirective[] {
    if (typeReferenceDirectiveNames.length === 0) {
      trace("resolveTypeReferenceDirectives", arguments);
      return [];
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
    trace("trace", arguments);
  }
  directoryExists?(directoryName: string): boolean {
    if (directoryName.match(/@types/)) {
      trace("directoryExists", arguments);
      return false; 
    } else {
      throw unimpl("directoryExists", arguments);
    }
  }
  realpath?(path: string): string {
    throw unimpl("realpath", arguments);
  }
}

function trace(name: string, args: IArguments | any[]) {
  console.log(`TRACE ${name}(${joinArgs(args)})`)
}

function unimpl(name: string, args: IArguments | any[]) {
  throw new Error(`Not implemented ${name}(${joinArgs(args)})`)
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

function toString(input: unknown) {
  try {
    let string = JSON.stringify(input);

    if (string !== undefined) {
      return string;
    } else {
      return String(input);
    }
  } catch {
    return String(input);
  }
}