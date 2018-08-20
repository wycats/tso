import * as path from "path";

export class AbsolutePath {
  readonly path: string;

  constructor(raw: string) {
    this.path = path.resolve(raw);
  }

  join(part: string): AbsolutePath {
    return new AbsolutePath(path.join(this.path, part));
  }

  joinToFile(part: string): AbsoluteFile {
    return new AbsoluteFile(path.join(this.path, part));
  }

  joinToDir(part: string): AbsoluteDirectory {
    return new AbsoluteDirectory(path.join(this.path, part));
  }

  dir(): AbsoluteDirectory {
    return new AbsolutePath(path.dirname(this.path));
  }

  contains(target: AbsolutePath): boolean {
    return path.relative(this.path, target.path)[0] !== ".";
  }
}

export class AbsoluteFile extends AbsolutePath {}
export class AbsoluteDirectory extends AbsolutePath {
  static cwd(): AbsoluteDirectory {
    return new AbsoluteDirectory(process.cwd());
  }
}
