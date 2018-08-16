import * as ts from "typescript";

export class SourceFile implements ts.SourceFile {
  kind: ts.SyntaxKind.SourceFile;
  statements: ts.NodeArray<ts.Statement>;
  endOfFileToken: ts.Token<ts.SyntaxKind.EndOfFileToken>;
  fileName: string;
  text: string;
  amdDependencies: ReadonlyArray<ts.AmdDependency>;
  moduleName?: string;
  referencedFiles: ReadonlyArray<ts.FileReference>;
  typeReferenceDirectives: ReadonlyArray<ts.FileReference>;
  libReferenceDirectives: ReadonlyArray<ts.FileReference>;
  languageVariant: ts.LanguageVariant;
  isDeclarationFile: boolean;
  hasNoDefaultLib: boolean;
  languageVersion: ts.ScriptTarget;
  getLineAndCharacterOfPosition(pos: number): ts.LineAndCharacter {
    throw new Error("Method not implemented.");
  }
  getLineEndOfPosition(pos: number): number {
    throw new Error("Method not implemented.");
  }
  getLineStarts(): ReadonlyArray<number> {
    throw new Error("Method not implemented.");
  }
  getPositionOfLineAndCharacter(line: number, character: number): number {
    throw new Error("Method not implemented.");
  }
  update(newText: string, textChangeRange: ts.TextChangeRange): ts.SourceFile {
    throw new Error("Method not implemented.");
  }
  _declarationBrand: any;
  flags: ts.NodeFlags;
  decorators?: ts.NodeArray<ts.Decorator>;
  modifiers?: ts.NodeArray<ts.Modifier>;
  parent: ts.Node;
  getSourceFile(): ts.SourceFile {
    throw new Error("Method not implemented.");
  }
  getChildCount(sourceFile?: ts.SourceFile): number {
    throw new Error("Method not implemented.");
  }
  getChildAt(index: number, sourceFile?: ts.SourceFile): ts.Node {
    throw new Error("Method not implemented.");
  }
  getChildren(sourceFile?: ts.SourceFile): ts.Node[] {
    throw new Error("Method not implemented.");
  }
  getStart(sourceFile?: ts.SourceFile, includeJsDocComment?: boolean): number {
    throw new Error("Method not implemented.");
  }
  getFullStart(): number {
    throw new Error("Method not implemented.");
  }
  getEnd(): number {
    throw new Error("Method not implemented.");
  }
  getWidth(sourceFile?: ts.SourceFileLike): number {
    throw new Error("Method not implemented.");
  }
  getFullWidth(): number {
    throw new Error("Method not implemented.");
  }
  getLeadingTriviaWidth(sourceFile?: ts.SourceFile): number {
    throw new Error("Method not implemented.");
  }
  getFullText(sourceFile?: ts.SourceFile): string {
    throw new Error("Method not implemented.");
  }
  getText(sourceFile?: ts.SourceFile): string {
    throw new Error("Method not implemented.");
  }
  getFirstToken(sourceFile?: ts.SourceFile): ts.Node {
    throw new Error("Method not implemented.");
  }
  getLastToken(sourceFile?: ts.SourceFile): ts.Node {
    throw new Error("Method not implemented.");
  }
  forEachChild<T>(
    cbNode: (node: ts.Node) => T,
    cbNodeArray?: (nodes: ts.NodeArray<ts.Node>) => T
  ): T {
    throw new Error("Method not implemented.");
  }
  pos: number;
  end: number;
}
