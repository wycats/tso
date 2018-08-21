"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ts = __importStar(require("typescript/lib/tsserverlibrary"));
const compiler_host_1 = __importDefault(require("../build/compiler-host"));
const fs_1 = require("../build/fs");
function create(info) {
    info.project.projectService.logger.info("Hello world my people");
    // Set up decorator
    const proxy = Object.create(null);
    for (let k of Object.keys(info.languageService)) {
        const x = info.languageService[k];
        proxy[k] = (...args) => x.apply(info.languageService, args);
    }
    proxy.getProgram = () => {
        let typescript = {
            target: ts.ScriptTarget.ES2015,
            module: ts.ModuleKind.ES2015,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            skipLibCheck: true,
            traceResolution: true
        };
        let host = new compiler_host_1.default(fs_1.AbsoluteDirectory.cwd(), {
            resolve: {
                "@cross-check/core": fs_1.AbsoluteDirectory.cwd()
                    .joinToDir("types")
                    .joinToFile("index.d.ts")
            },
            typescript
        });
        return ts.createProgram({
            rootNames: [],
            host,
            options: typescript
        });
    };
    return proxy;
}
const init = (mod) => {
    return { create };
};
module.exports = init;
