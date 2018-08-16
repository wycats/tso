import { ValidationDescriptor, ValidationError } from "./index";
export declare type BasicValidator<T> = (value: T) => ValidationError[] | void;
export declare type HigherOrderBasicValidator<T, Options> = ((options?: Options) => (value: T) => boolean);
/**
 * @api primitive
 *
 * A function that takes a synchronous, basic validator factory and produces
 * a validator descriptor.
 *
 * @param name
 * @param validatorFunction
 */
export declare function validator<T>(name: string, validatorFunction: () => (value: T) => boolean): () => ValidationDescriptor<T, void>;
export declare function validator<T, Options>(name: string, validatorFunction: (options: Options) => (value: T) => boolean): (options: Options) => ValidationDescriptor<T, Options>;
//# sourceMappingURL=validator.d.ts.map