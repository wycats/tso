"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const path = require("path");
const fs = require("fs");
const utils_1 = require("./utils");
const pathCompleteExtname = require("path-complete-extname");
const CONFIG = {
    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames
};
class CompilerHost {
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) {
        return tracing("getSourceFile", [fileName, languageVersion, desc("onError"), shouldCreateNewSourceFile], () => ts.createSourceFile(fileName, fs.readFileSync(fileName, { encoding: "utf8" }), languageVersion, false, ts.ScriptKind.TS), "SourceFile");
    }
    getSourceFileByPath(fileName, path, languageVersion, onError, shouldCreateNewSourceFile) {
        return tracing("getSourceFileByPath", arguments, () => {
            throw new Error("getSourceFileByPath not implemented.");
        });
    }
    getCancellationToken() {
        throw unimpl("getCancellationToken", arguments);
    }
    getDefaultLibFileName(options) {
        return tracing("getDefaultLibFileName", arguments, () => path.resolve(this.cwd, "node_modules", "typescript", "lib", "lib.es2015.d.ts"), "Path");
    }
    getDefaultLibLocation() {
        return tracing("getDefaultLibLocation", arguments, () => path.resolve(this.cwd, "node_modules", "typescript", "lib"));
    }
    writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles) {
        tracing("writeFile", [fileName], () => fs.writeFileSync(fileName, data));
    }
    getCurrentDirectory() {
        // trace("getCurrentDirectory", arguments);
        return this.cwd;
    }
    getDirectories(path) {
        throw unimpl("getDirectories", arguments);
    }
    getCanonicalFileName(fileName) {
        // trace("getCanonicalFileName", arguments);
        return CONFIG.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    }
    useCaseSensitiveFileNames() {
        // trace("useCaseSensitiveFileNames", arguments)
        return CONFIG.useCaseSensitiveFileNames;
    }
    getNewLine() {
        // trace("getNewLine", arguments);
        return "\n";
    }
    readDirectory(rootDir, extensions, excludes, includes, depth) {
        throw unimpl("readDirectory", arguments);
    }
    resolveModuleNames(moduleNames, containingFile, reusedNames) {
        return moduleNames.map(name => {
            return tracing("resolveModuleNames", arguments, () => {
                if (utils_1.isRelative(name)) {
                    return {
                        resolvedFileName: `${path.resolve(path.dirname(containingFile), name)}${pathCompleteExtname(containingFile)}`,
                        isExternalModule: false
                    };
                }
                else {
                    let pkgDir = path.resolve(process.cwd(), "node_modules", name);
                    let pkg = require(path.join(pkgDir, "package.json"));
                    if (pkg.types) {
                        return {
                            resolvedFileName: path.join(pkgDir, pkg.types),
                            isExternalModule: true
                        };
                    }
                    else {
                        console.log(`${name} from node_modules not yet implemented without types entry`);
                        throw unimpl("resolveModuleNames", arguments);
                    }
                }
            });
        });
    }
    resolveTypeReferenceDirectives(typeReferenceDirectiveNames, containingFile) {
        if (typeReferenceDirectiveNames.length === 0) {
            return tracing("resolveTypeReferenceDirectives", arguments, () => []);
        }
        else {
            throw unimpl("resolveTypeReferenceDirectives", arguments);
        }
    }
    getEnvironmentVariable(name) {
        throw unimpl("getEnvironmentVariable", arguments);
    }
    createHash(data) {
        throw unimpl("createHash", arguments);
    }
    getModifiedTime(fileName) {
        throw unimpl("getModifiedTime", arguments);
    }
    setModifiedTime(fileName, date) {
        throw unimpl("setModifiedTime", arguments);
    }
    deleteFile(fileName) {
        throw unimpl("deleteFile", arguments);
    }
    fileExists(fileName) {
        throw unimpl("fileExists", arguments);
    }
    readFile(fileName) {
        throw unimpl("readFile", arguments);
    }
    trace(s) {
        tracing("trace", arguments, () => null);
    }
    directoryExists(directoryName) {
        if (directoryName.match(/@types/)) {
            return tracing("directoryExists", arguments, () => false);
        }
        else {
            throw unimpl("directoryExists", arguments);
        }
    }
    realpath(path) {
        throw unimpl("realpath", arguments);
    }
}
exports.default = CompilerHost;
let pad = 0;
function tracing(name, args, callback, kind) {
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
function unimpl(name, args) {
    throw new Error(`Not implemented ${name}(${joinArgs(args)})`);
}
function joinArgs(args) {
    let out = [];
    for (let i = 0; i < args.length; i++) {
        if (args[i] === undefined) {
            out.push("undefined");
        }
        else {
            out.push(toString(args[i]));
        }
    }
    return out.join(", ");
}
function isSourceFile(input, kind) {
    return kind === "SourceFile";
}
const DESC = Symbol("Desc");
function desc(s) {
    return {
        [DESC]: true,
        desc: s
    };
}
function isDesc(value) {
    return value && typeof value === "object" && DESC in value;
}
function isPath(value, kind) {
    return kind === "Path";
}
function toString(input, kind) {
    if (isSourceFile(input, kind)) {
        return `SourceFile { fileName: ${JSON.stringify(input.fileName)} }`;
    }
    else if (isPath(input, kind)) {
        return `Path { file: ${input} }`;
    }
    if (isDesc(input)) {
        return input.desc;
    }
    try {
        let string = JSON.stringify(input, null, 2);
        if (string !== undefined) {
            return string;
        }
        else {
            return String(input);
        }
    }
    catch (_a) {
        return String(input);
    }
}
