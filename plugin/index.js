"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const ts = __importStar(require("typescript/lib/tsserverlibrary"));
const fs_1 = require("../build/fs");
function create(info) {
    info.project.projectService.logger.info("Hello world my people");
    // Set up decorator
    const proxy = Object.create(null);
    for (let k of Object.keys(info.languageService)) {
        const x = info.languageService[k];
        proxy[k] = (...args) => x.apply(info.languageService, args);
    }
    let root = new fs_1.AbsoluteDirectory(require("path").resolve(__dirname, ".."));
    info.project.projectService.openExternalProject({
        projectFileName: root.joinToFile("package.json").path,
        rootFiles: [
            {
                fileName: root.joinToDir("src").joinToFile("index.ts").path,
                scriptKind: ts.ScriptKind.TS
            }
        ],
        options: {
            target: ts.ScriptTarget.ES2018,
            module: ts.ModuleKind.ES2015,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            skipLibCheck: true,
            traceResolution: true
        }
    });
    info.project.projectService.openExternalProject({
        projectFileName: root.joinToFile("package.json").path,
        rootFiles: [
            {
                fileName: root.joinToDir("test").joinToFile("core-test.ts").path,
                scriptKind: ts.ScriptKind.TS
            },
            {
                fileName: root.joinToDir("src").joinToFile("index.ts").path,
                scriptKind: ts.ScriptKind.TS
            }
        ],
        options: {
            target: ts.ScriptTarget.ES2018,
            module: ts.ModuleKind.ES2015,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            skipLibCheck: true,
            traceResolution: true,
            paths: {
                "@cross-check/core": [root.joinToDir("src").joinToFile("index.ts").path]
            }
        }
    });
    return proxy;
}
const init = (mod) => {
    return { create };
};
module.exports = init;
