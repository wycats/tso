import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import { Artifact } from "./profiles";

export class AbsolutePath {
  readonly path: string;

  constructor(raw: string) {
    this.path = path.resolve(raw);
  }

  join(part: string): AbsolutePath {
    return new AbsolutePath(path.join(this.path, part));
  }

  dir(): AbsolutePath {
    return new AbsolutePath(path.dirname(this.path));
  }
}

export class AbsoluteFile extends AbsolutePath {}
export class AbsoluteDirectory extends AbsolutePath {}

export interface ProjectSettings {
  manifest: AbsoluteFile;
  src: AbsoluteFile;
  test: AbsoluteFile[];
}

export class Manifest {
  private rawJson: null | object = null;

  constructor(private absolute: AbsoluteFile) {}

  get json(): object {
    let json = this.rawJson;

    if (!json) {
      let manifestPath = this.absolute.path;
      let contents = fs.readFileSync(manifestPath, { encoding: "utf8" });
      json = JSON.parse(contents);
    }

    return json;
  }

  get name(): string {
    return this.json["name"];
  }
}

export class Project {
  private manifest: Manifest;

  constructor(private settings: ProjectSettings) {
    this.manifest = new Manifest(settings.manifest);
  }

  get src(): Artifact {
    return new Artifact([this.settings.src]);
  }

  get test(): Artifact {
    return new Artifact(this.settings.test);
  }

  get name(): string {
    return this.manifest.name;
  }

  compile() {
    this.src.compile();
    // this.test.compile();
  }
}
