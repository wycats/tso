import * as path from "path";
import * as fs from "fs";
import { Artifact } from "./profiles";
import walk from "walk-sync";
import { AbsoluteFile, AbsolutePath } from "./fs";
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
    let main = this.json["main"] as string;
    let resolved = path.resolve(this.absolute.dir().path, main);
    return new AbsoluteFile(resolved);
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

  get src(): Artifact {
    return new Artifact([this.settings.src], {});
  }

  get test(): Artifact {
    return new Artifact(this.settings.test, {
      [this.manifest.name]: this.manifest.main
    });
  }

  get name(): string {
    return this.manifest.name;
  }

  compile() {
    this.src.compile();
    this.test.compile();
  }
}
