import * as ts from "typescript";

declare module "typescript" {
  export namespace performance {
    const onProfilerEvent: { (markName: string): void; profiler: boolean };

    /**
     * Marks a performance event.
     *
     * @param markName The name of the mark.
     */
    export function mark(markName: string): void;

    /**
     * Adds a performance measurement with the specified name.
     *
     * @param measureName The name of the performance measurement.
     * @param startMarkName The name of the starting mark. If not supplied, the point at which the
     *      profiler was enabled is used.
     * @param endMarkName The name of the ending mark. If not supplied, the current timestamp is
     *      used.
     */
    export function measure(
      measureName: string,
      startMarkName?: string,
      endMarkName?: string
    ): void;

    /**
     * Gets the number of times a marker was encountered.
     *
     * @param markName The name of the mark.
     */
    export function getCount(markName: string): void;

    /**
     * Gets the total duration of all measurements with the supplied name.
     *
     * @param measureName The name of the measure whose durations should be accumulated.
     */
    export function getDuration(measureName: string): void;

    /**
     * Iterate over each measure, performing some action
     *
     * @param cb The action to perform for each measure
     */
    export function forEachMeasure(
      cb: (measureName: string, duration: number) => void
    ): void;

    /** Enables (and resets) performance measurements for the compiler. */
    export function enable(): void;

    /** Disables performance measurements for the compiler. */
    export function disable(): void;
  }
}
