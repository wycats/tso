import * as path from "path";

export class AbsolutePath {
  readonly path: string;

  constructor(raw: string) {
    this.path = path.resolve(raw);
  }

  join(part: string): AbsolutePath {
    return new AbsolutePath(path.join(this.path, part));
  }

  dir(): AbsoluteDirectory {
    return new AbsolutePath(path.dirname(this.path));
  }
}

export class AbsoluteFile extends AbsolutePath {}
export class AbsoluteDirectory extends AbsolutePath {
  static cwd(): AbsoluteDirectory {
    return new AbsoluteDirectory(process.cwd());
  }
}
