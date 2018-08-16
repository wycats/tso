export enum StatsKind {
  Time,
  Count
}

export interface CompileDelegate {
  log(s: string): void;
  stats(name: string, kind: StatsKind, amount: number): void;
}

export class SimpleCompileDelegate {
  log(s: string): void {
    console.log(s);
  }

  stats(name: string, kind: StatsKind, amount: number): void {
    console.log(name, amount);
  }
}
