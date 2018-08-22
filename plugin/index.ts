import * as ts from "typescript/lib/tsserverlibrary";
import CompilerHost from "../build/compiler-host";
import { AbsoluteDirectory, AbsoluteFile } from "../build/fs";

function create(info: ts.server.PluginCreateInfo) {
  info.project.projectService.logger.info("Hello world my people");

  // Set up decorator
  const proxy: ts.LanguageService = Object.create(null);
  for (let k of Object.keys(info.languageService) as Array<
    keyof ts.LanguageService
  >) {
    const x = info.languageService[k];
    proxy[k] = (...args: Array<{}>) => x!.apply(info.languageService, args);
  }

  let root = new AbsoluteDirectory(require("path").resolve(__dirname, ".."));

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

const init: ts.server.PluginModuleFactory = (mod: {
  typescript: typeof ts;
}) => {
  return { create };
};

export = init;
