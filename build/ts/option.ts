export function unwrap<T>(value: T | null): T {
  if (value === null) {
    throw new Error("TODO: Unexpected null");
  } else {
    return value;
  }
}
