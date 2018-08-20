export function unwrap<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error(`TODO: Unexpected ${value}`);
  } else {
    return value;
  }
}
