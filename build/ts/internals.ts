import * as ts from "typescript";

export const nodeCoreModules: ts.Map<true> = (ts as any).JsTyping
  .nodeCoreModules;
