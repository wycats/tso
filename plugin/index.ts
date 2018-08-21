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

  proxy.getProgram = () => {
    let typescript = {
      target: ts.ScriptTarget.ES2015,
      module: ts.ModuleKind.ES2015,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      skipLibCheck: true,
      traceResolution: true
    };

    let host = new CompilerHost(AbsoluteDirectory.cwd(), {
      resolve: {
        "@cross-check/core": AbsoluteDirectory.cwd()
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

const init: ts.server.PluginModuleFactory = (mod: {
  typescript: typeof ts;
}) => {
  return { create };
};

export = init;
