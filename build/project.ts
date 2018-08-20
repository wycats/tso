import * as path from "path";
import * as fs from "fs";
import { Artifact, ProfileKind } from "./profiles";
import walk from "walk-sync";
import * as ts from "typescript";
import { AbsoluteFile, AbsolutePath, AbsoluteDirectory } from "./fs";
import { unwrap } from "./ts";

export interface ProjectSettings {
  manifest: AbsoluteFile;
  src: AbsoluteFile;
  test: AbsoluteFile[];
}

export class Manifest {
  private rawJson: null | object = null;

  constructor(private absolute: AbsoluteFile) {}

  get root(): AbsolutePath {
    return this.absolute.dir();
  }

  get json(): { [key: string]: unknown } {
    let json = this.rawJson;

    if (!json) {
      let manifestPath = this.absolute.path;
      let contents = fs.readFileSync(manifestPath, { encoding: "utf8" });
      json = unwrap(JSON.parse(contents)) as object;
    }

    return json;
  }

  get main(): AbsoluteFile {
    let main = this.json["typescript:main"] as string | undefined;

    if (main === undefined) {
      let resolved = path.resolve(this.absolute.dir().path, "src", "index.ts");
      return new AbsoluteFile(resolved);
    } else {
      let resolved = path.resolve(this.absolute.dir().path, main);
      return new AbsoluteFile(resolved);
    }
  }

  get dist(): AbsoluteDirectory {
    // TODO: Verify that we actually end up with something in dist that matches main
    let main = this.json["main"] as string | undefined;

    if (main) {
      let resolved = path.resolve(this.absolute.dir().path, main);
      return new AbsoluteFile(resolved).dir();
    } else {
      let resolved = path.resolve(this.absolute.dir().path, "dist");
      return new AbsoluteDirectory(resolved);
    }
  }

  get types(): AbsoluteDirectory {
    let types = this.json["types"] as string | undefined;

    if (types) {
      let resolved = path.resolve(this.absolute.dir().path, types);
      return new AbsoluteFile(resolved).dir();
    } else {
      let resolved = path.resolve(this.absolute.dir().path, "types");
      return new AbsoluteDirectory(resolved);
    }
  }

  get name(): string {
    return this.json["name"] as string;
  }
}

export interface ProjectOptions {
  manifest: AbsoluteFile;
  test: string;
}

export class Project {
  static fromOptions(options: ProjectOptions) {
    let manifest = new Manifest(options.manifest);
    let entry = manifest.main;
    let tests = walk(manifest.root.path, { globs: [options.test] });

    return new Project(manifest, {
      manifest: options.manifest,
      src: entry,
      test: tests.map(f => new AbsoluteFile(f))
    });
  }

  private constructor(
    private manifest: Manifest,
    private settings: ProjectSettings
  ) {
    this.manifest = manifest;
  }

  src(lastProgram?: ts.Program): Artifact {
    return new Artifact({
      entry: [this.settings.src],
      packages: {},
      kind: ProfileKind.Project,
      dist: this.manifest.dist,
      types: this.manifest.types
    });
  }

  test(lastProgram?: ts.Program): Artifact {
    return new Artifact({
      entry: this.settings.test,
      packages: {
        [this.manifest.name]: this.manifest.types.joinToFile("index.d.ts")
      },
      kind: ProfileKind.Test,
      target: this.manifest.root.joinToDir("target"),
      lastProgram
    });
  }

  get name(): string {
    return this.manifest.name;
  }

  compile() {
    let program = this.src().compile();
    this.test(program).compile();
  }
}
