"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const path = require("path");
const fs = require("fs");
const utils_1 = require("./utils");
const pathCompleteExtname = require("path-complete-extname");
const mkdirp = require("mkdirp");
const CONFIG = {
    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames
};
class CompilerHost {
    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }
    getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) {
        trace("getSourceFile", [fileName, languageVersion, function onError() { }, shouldCreateNewSourceFile]);
        return ts.createSourceFile(fileName, fs.readFileSync(fileName, { encoding: "utf8" }), languageVersion, false, ts.ScriptKind.TS);
    }
    getSourceFileByPath(fileName, path, languageVersion, onError, shouldCreateNewSourceFile) {
        trace("getSourceFileByPath", arguments);
        throw new Error("getSourceFileByPath not implemented.");
    }
    getCancellationToken() {
        throw unimpl("getCancellationToken", arguments);
    }
    getDefaultLibFileName(options) {
        trace("getDefaultLibFileName", arguments);
        return path.resolve(this.cwd, "node_modules", "typescript", "lib", "lib.es2015.d.ts");
    }
    getDefaultLibLocation() {
        trace("getDefaultLibLocation", arguments);
        return path.resolve(this.cwd, "node_modules", "typescript", "lib");
    }
    writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles) {
        fs.writeFileSync(fileName, data);
        trace("writeFile", [fileName]);
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
            trace("resolveModuleNames", arguments);
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
                    trace("resolveModuleNames", arguments);
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
    }
    resolveTypeReferenceDirectives(typeReferenceDirectiveNames, containingFile) {
        if (typeReferenceDirectiveNames.length === 0) {
            trace("resolveTypeReferenceDirectives", arguments);
            return [];
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
        trace("trace", arguments);
    }
    directoryExists(directoryName) {
        if (directoryName.match(/@types/)) {
            trace("directoryExists", arguments);
            return false;
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
function trace(name, args) {
    console.log(`TRACE ${name}(${joinArgs(args)})`);
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
function toString(input) {
    try {
        let string = JSON.stringify(input);
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
